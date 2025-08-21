'use server'

import prisma from '@/lib/db'
import { completedShiftsSelect } from '@/lib/prisma/shifts/select'
import { getActiveMember } from '@/lib/server-utils'
import { getCompletedShiftsSchema } from '@/lib/validations/admin'
import { endOfDay, startOfDay } from 'date-fns'

export const getCompletedShifts = async (data: unknown) => {
  const validatedData = getCompletedShiftsSchema.safeParse(data)

  if (!validatedData.success) {
    return { message: 'Invalid input, Please try again.' }
  }

  const { date } = validatedData.data

  const activeMember = await getActiveMember()

  if (!activeMember || activeMember.role === 'member') {
    return {
      message: 'Not authorized',
    }
  }

  try {
    const shifts = await prisma.attendance.findMany({
      where: {
        checkInTime: {
          gte: startOfDay(date),
          lte: endOfDay(date),
        },
        organizationId: activeMember.organizationId,
      },
      select: completedShiftsSelect,
    })

    return { success: true, data: shifts }
  } catch (err) {
    return { success: false, message: 'Something went wrong, try again' }
  }
}
