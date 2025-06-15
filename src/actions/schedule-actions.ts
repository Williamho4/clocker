'use server'

import { auth } from '@/lib/auth'
import prisma from '@/lib/db'
import { Organization, User } from '@prisma/client'
import { addDays, startOfDay, startOfWeek } from 'date-fns'
import { headers } from 'next/headers'

export const createShift = async (
  startDate: Date,
  endDate: Date,
  employeeId: User['id'],
  organizationId: Organization['id']
) => {
  const activeMember = await auth.api.getActiveMember({
    headers: await headers(),
  })

  if (!activeMember || activeMember.role === 'member') {
    return {
      message: 'Not authorized',
    }
  }

  const weekStart = startOfWeek(startDate, { weekStartsOn: 1 })
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const date = addDays(weekStart, i)
    return date
  })

  const existingSchedule = await prisma.schedule.findUnique({
    where: {
      date_organizationId: {
        date: weekDays[0],
        organizationId,
      },
    },
  })

  if (!existingSchedule) {
    await Promise.all(
      weekDays.map((date) =>
        prisma.schedule.create({
          data: {
            date,
            organizationId,
          },
        })
      )
    )
  }

  const schedule = await prisma.schedule.findUnique({
    where: {
      date_organizationId: {
        date: startOfDay(startDate),
        organizationId,
      },
    },
    select: {
      id: true,
    },
  })

  if (!schedule) throw new Error('Schedule not found')

  if (startDate > endDate) {
    endDate = addDays(endDate, 1)
  }

  try {
    await prisma.shift.create({
      data: {
        startTime: startDate,
        endTime: endDate,
        user: {
          connect: { id: employeeId },
        },
        schedule: {
          connect: { id: schedule.id },
        },
      },
    })
  } catch (error) {
    console.log(error)
  }
}

export const deleteShift = async (shiftId: string) => {
  const activeMember = await auth.api.getActiveMember({
    headers: await headers(),
  })

  if (!activeMember || activeMember.role === 'member') {
    return {
      message: 'Not authorized',
    }
  }

  try {
    await prisma.shift.delete({
      where: {
        id: shiftId,
      },
    })
  } catch (error) {
    return {
      message: 'Could not delete shift',
    }
  }
}

export const getSchedulesForWeek = async (
  startTime: Date,
  endTime: Date,
  organizationId: Organization['id']
) => {
  const schedules = await prisma.schedule.findMany({
    where: {
      date: {
        gte: startTime,
        lte: endTime,
      },
      organizationId,
    },
    include: {
      shifts: {
        include: {
          user: {
            select: {
              firstName: true,
              lastName: true,
            },
          },
        },
      },
    },
  })

  return schedules
}
