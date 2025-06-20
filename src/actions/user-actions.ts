'use server'

import { auth } from '@/lib/auth'
import prisma from '@/lib/db'
import { organizationWithMemberRoleSelect } from '@/lib/prisma/organization/select'
import { Shift } from '@prisma/client'
import { Member } from 'better-auth/plugins'
import { endOfWeek, startOfDay, startOfWeek, subDays } from 'date-fns'
import { connect } from 'http2'
import { headers } from 'next/headers'

export const checkIfUserExists = async (email: string) => {
  const userExists = await prisma.user.findUnique({
    where: { email: email },
  })

  if (userExists) {
    return true
  } else {
    return false
  }
}

export const getAllUsersOrganizations = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    return
  }

  return await prisma.organization.findMany({
    where: {
      members: {
        some: {
          userId: session.user.id,
        },
      },
    },
    select: {
      ...organizationWithMemberRoleSelect,
      members: {
        where: { userId: session.user.id },
        select: organizationWithMemberRoleSelect.members.select,
      },
    },
  })
}

export async function getAllUserShifts(activeMember: Member) {
  if (!activeMember) {
    return []
  }

  const shifts = await prisma.shift.findMany({
    where: {
      memberId: activeMember.id,
      startTime: {
        gte: subDays(new Date(), 7),
      },
      schedule: {
        organizationId: activeMember.organizationId,
      },
    },
    orderBy: {
      startTime: 'asc',
    },
  })

  return shifts
}

export async function getTotalHoursWorkedThisMonth() {
  const activeMember = await auth.api.getActiveMember({
    headers: await headers(),
  })

  if (!activeMember) {
    return null
  }

  try {
    const attendances = await prisma.attendance.findMany({
      where: {
        memberId: activeMember.id,
        checkInTime: {
          gte: startOfWeek(new Date()),
          lte: endOfWeek(new Date()),
        },
        organizationId: activeMember.organizationId,
      },
    })

    let totalMilliseconds = 0

    for (const att of attendances) {
      if (att.checkInTime && att.checkOutTime) {
        totalMilliseconds +=
          att.checkOutTime.getTime() - att.checkInTime.getTime()
      }
    }

    const totalHours = Math.round(totalMilliseconds / (1000 * 60 * 60))
    return totalHours
  } catch {
    return null
  }
}

export async function getTotalHoursPlannedThisWeek() {
  const activeMember = await auth.api.getActiveMember({
    headers: await headers(),
  })

  if (!activeMember) {
    return null
  }

  try {
    const shifts = await prisma.shift.findMany({
      where: {
        memberId: activeMember.id,
        startTime: {
          gte: startOfWeek(new Date()),
          lte: endOfWeek(new Date()),
        },
        schedule: {
          organizationId: activeMember.organizationId,
        },
      },
    })

    let totalMilliseconds = 0

    for (const shift of shifts) {
      totalMilliseconds += shift.endTime.getTime() - shift.startTime.getTime()
    }

    const totalHours = Math.round(totalMilliseconds / (1000 * 60 * 60))
    return totalHours
  } catch {
    return null
  }
}

export async function getTotalUpcomingShifts() {
  const activeMember = await auth.api.getActiveMember({
    headers: await headers(),
  })

  if (!activeMember) {
    return null
  }

  try {
    const shifts = await prisma.shift.count({
      where: {
        memberId: activeMember.id,
        startTime: {
          gte: startOfDay(new Date()),
        },
        schedule: {
          organizationId: activeMember.organizationId,
        },
      },
    })

    return shifts
  } catch {
    return null
  }
}

export async function createShiftChangeRequest(
  colleagueId: Member['id'],
  shiftId: Shift['id']
) {
  const activeMember = await auth.api.getActiveMember({
    headers: await headers(),
  })

  if (!activeMember) {
    return
  }

  try {
    const shiftToGetChanged = await prisma.shift.findUnique({
      where: {
        id: shiftId,
      },
    })

    if (!shiftToGetChanged) {
      throw new Error('Shift not found')
    }

    const collegueIsNotAvailable = await prisma.shift.findFirst({
      where: {
        memberId: colleagueId,
        startTime: {
          lte: shiftToGetChanged.endTime,
        },
        endTime: {
          gte: shiftToGetChanged.startTime,
        },
      },
    })

    if (collegueIsNotAvailable) {
      return {
        message: 'Colleague is not available',
      }
    }

    const checkIfAlreadyRequested = await prisma.shiftRequest.findFirst({
      where: {
        shiftId,
      },
    })

    if (checkIfAlreadyRequested) {
      return {
        message: 'Request Already Sent',
      }
    }
  } catch {
    return {
      message: 'Something went wrong please try again',
    }
  }

  try {
    await prisma.shiftRequest.create({
      data: {
        receiver: {
          connect: { id: colleagueId },
        },
        requester: {
          connect: {
            id: activeMember.id,
          },
        },
        shift: {
          connect: {
            id: shiftId,
          },
        },
      },
    })
  } catch {
    return {
      message: 'Something went wrong please try again',
    }
  }
}
