'use server'

import { auth } from '@/lib/auth'
import prisma from '@/lib/db'
import {
  MemberWithUser,
  memberWithUserSelect,
} from '@/lib/prisma/member/select'
import {
  checkIfCheckedInAlready,
  checkIfOnBreak,
  checkIfShiftExistForAttendance,
  createBreak,
  editBreakToDone,
} from '@/lib/server-utils'
import { revalidatePath } from 'next/cache'
import { headers } from 'next/headers'

export const getAllActiveAttendances = async (organizationId: string) => {
  try {
    const attendances = await prisma.attendance.findMany({
      where: {
        organizationId,
        status: 'CHECKED_IN',
      },
      orderBy: {
        checkInTime: 'asc',
      },
      include: {
        member: {
          include: {
            user: true,
          },
        },
        breaks: {
          where: {
            status: 'PENDING',
          },
        },
        shift: true,
      },
    })

    return attendances
  } catch (error) {
    console.log(error)
    return []
  }
}

export const checkOutEmployee = async (attendanceId: string, orgId: string) => {
  const onBreak = await checkIfOnBreak(attendanceId)

  if (onBreak) {
    const pause = await editBreakToDone(onBreak.id)

    if (!pause) {
      return { message: 'Could not check out, please try again' }
    }
  }

  try {
    await prisma.attendance.update({
      where: {
        id: attendanceId,
      },
      data: {
        status: 'CHECKED_OUT',
        checkOutTime: new Date(),
      },
    })
    revalidatePath(`/app/${orgId}/check-in`)
  } catch {
    return { message: 'Could not check out' }
  }
}

export const checkInEmployee = async (orgId: string, memberId: string) => {
  const activeMember = await auth.api.getActiveMember({
    headers: await headers(),
  })

  if (activeMember?.organizationId !== orgId) {
    return { message: 'Could not check in' }
  }

  const checkedIn = await checkIfCheckedInAlready(orgId, memberId)

  if (checkedIn) {
    return { message: 'Already checked in' }
  }

  const shift = await checkIfShiftExistForAttendance(memberId)

  try {
    await prisma.attendance.create({
      data: {
        status: 'CHECKED_IN',
        checkInTime: new Date(),
        organization: {
          connect: { id: orgId },
        },
        member: {
          connect: { id: memberId },
        },
        ...(shift && {
          shift: {
            connect: { id: shift.id },
          },
        }),
      },
    })
    revalidatePath(`/app/${orgId}/check-in`)
  } catch {
    return { message: 'Could not check in' }
  }
}

export const searchOrgMember = async (
  orgId: string,
  employeeName: string
): Promise<MemberWithUser[]> => {
  const activeMember = await auth.api.getActiveMember({
    headers: await headers(),
  })

  if (activeMember?.organizationId !== orgId) {
    console.error('Not authorized')
    return []
  }

  try {
    const members = await prisma.member.findMany({
      where: {
        organizationId: orgId,
        user: {
          name: {
            contains: employeeName,
            mode: 'insensitive',
          },
        },
      },
      select: memberWithUserSelect,
    })

    return members
  } catch (error) {
    console.error('Failed to search members:', error)
    return []
  }
}

export const startBreak = async (attendanceId: string, orgId: string) => {
  const alreadyOnBreak = await checkIfOnBreak(attendanceId)

  if (alreadyOnBreak) {
    return { message: 'Already on break' }
  }

  const pause = await createBreak(attendanceId)

  if (!pause) {
    return { message: 'Could not start break' }
  }

  revalidatePath(`/app/${orgId}/check-in`)
}

export const stopBreak = async (breakId: string, orgId: string) => {
  const pause = await editBreakToDone(breakId)

  if (!pause) {
    return { message: 'Could not stop break' }
  }

  revalidatePath(`/app/${orgId}/check-in`)
}
