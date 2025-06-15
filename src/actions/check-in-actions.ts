'use server'

import prisma from '@/lib/db'
import { revalidatePath } from 'next/cache'

export const getAllActiveShifts = async (organizationId: string) => {
  try {
    const shifts = await prisma.shift.findMany({
      where: {
        status: 'CHECKED_IN',
        schedule: {
          organizationId,
        },
      },
      include: {
        user: true,
      },
    })

    return shifts
  } catch (error) {
    console.log(error)
    return []
  }
}

export const checkOutEmployee = async (shiftId: string, orgId: string) => {
  try {
    await prisma.shift.update({
      where: {
        id: shiftId,
      },
      data: {
        status: 'CHECKED_OUT',
        checkOutTime: new Date(),
      },
    })
  } catch (error) {
    return { message: 'Could not check out' }
  }

  revalidatePath(`/app/${orgId}/check-in`)
}
