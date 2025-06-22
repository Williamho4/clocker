'use server'

import prisma from '@/lib/db'
import { scheduleSelect } from '@/lib/prisma/schedule/select'
import { getActiveMember } from '@/lib/server-utils'
import { weekToDates } from '@/lib/utils'
import {
  createShiftSchema,
  deleteShiftSchema,
  getSchedulesForWeekSchema,
} from '@/lib/validations/schedule'
import { addDays, startOfDay } from 'date-fns'
import { revalidatePath } from 'next/cache'

export const createShift = async (data: unknown) => {
  const validatedData = createShiftSchema.safeParse(data)

  if (!validatedData.success) {
    return { message: 'Invalid input. Please try again.' }
  }

  const { shiftStartDate, shiftEndDate, employeeId } = validatedData.data

  const activeMember = await getActiveMember()

  const { organizationId } = activeMember

  if (activeMember.role === 'member') {
    return {
      message: 'Not authorized',
    }
  }

  const checkIfSchedulesAlreadyCreated = await prisma.schedule.findFirst({
    where: {
      date: startOfDay(shiftStartDate),
      organizationId,
    },
  })

  if (!checkIfSchedulesAlreadyCreated) {
    prisma.schedule.create({
      data: {
        date: startOfDay(shiftStartDate),
        organizationId,
      },
    })
  }

  const schedule = await prisma.schedule.findUnique({
    where: {
      date_organizationId: {
        date: startOfDay(shiftStartDate),
        organizationId,
      },
    },
    select: {
      id: true,
    },
  })

  if (!schedule) throw new Error('Schedule not found')

  const fixedEndDate =
    shiftStartDate > shiftEndDate ? addDays(shiftEndDate, 1) : shiftEndDate

  const employeeAlreadyHasShift = await prisma.shift.findFirst({
    where: {
      memberId: employeeId,
      schedule: {
        organizationId,
      },
      startTime: {
        lt: fixedEndDate,
      },
      endTime: {
        gt: shiftStartDate,
      },
    },
  })

  if (employeeAlreadyHasShift) {
    return {
      message: 'The employee already has a shift this time',
    }
  }

  try {
    await prisma.shift.create({
      data: {
        startTime: shiftStartDate,
        endTime: fixedEndDate,
        member: {
          connect: { id: employeeId },
        },
        schedule: {
          connect: { id: schedule.id },
        },
      },
    })

    revalidatePath(`/application/scheduler`)
  } catch {
    return {
      message: 'Something went wrong please try again',
    }
  }
}

export const deleteShift = async (data: unknown) => {
  const validatedData = deleteShiftSchema.safeParse(data)

  if (!validatedData.success) {
    return { message: 'Invalid input, Please try again.' }
  }

  const { shiftId } = validatedData.data

  const activeMember = await getActiveMember()

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
  } catch {
    return {
      message: 'Could not delete shift',
    }
  }

  revalidatePath(`/application/scheduler`)
}

export const getSchedulesForWeek = async (data: unknown) => {
  const validatedData = getSchedulesForWeekSchema.safeParse(data)

  if (!validatedData.success) {
    return { success: false, message: 'Invalid input, try again' }
  }

  const { week, year } = validatedData.data

  const activeMember = await getActiveMember()

  const { organizationId } = activeMember

  const dates = await weekToDates(week, year)

  const schedules = await prisma.schedule.findMany({
    where: {
      date: {
        gte: dates[0],
        lte: dates[1],
      },
      organizationId: organizationId,
    },
    include: scheduleSelect,
  })

  return { success: true, data: schedules }
}
