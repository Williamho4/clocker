'use server'

import { auth } from '@/lib/auth'
import prisma from '@/lib/db'
import { endOfWeek, startOfDay, startOfWeek, subDays } from 'date-fns'
import { headers } from 'next/headers'

export async function getAllUserShifts() {
  const activeMember = await auth.api.getActiveMember({
    headers: await headers(),
  })

  if (!activeMember) {
    return []
  }

  const shifts = await prisma.shift.findMany({
    where: {
      userId: activeMember.user.id,
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
        userId: activeMember.user.id,
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
        userId: activeMember.user.id,
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
