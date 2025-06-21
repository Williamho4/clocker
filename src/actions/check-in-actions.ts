'use server'

import prisma from '@/lib/db'
import { memberWithUserSelect } from '@/lib/prisma/member/select'
import {
  checkIfCheckedInAlready,
  checkIfOnBreak,
  checkIfShiftExistForAttendance,
  createBreak,
  editBreakToDone,
  getActiveMember,
} from '@/lib/server-utils'
import {
  checkInEmployeeSchema,
  checkOutEmployeeSchema,
  searchOrgMemberSchema,
  startBreakSchema,
  stopBreakSchema,
} from '@/lib/validations/check-in'
import { revalidatePath } from 'next/cache'

export const getAllActiveAttendances = async () => {
  const activeMember = await getActiveMember()

  const { organizationId } = activeMember

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

    return { success: true, data: attendances }
  } catch {
    return { success: false, message: 'Something went wrong, try again' }
  }
}

export const checkOutEmployee = async (data: unknown) => {
  const validatedData = checkOutEmployeeSchema.safeParse(data)

  if (!validatedData.success) {
    return { message: 'Invalid input. Please try again.' }
  }

  const { attendanceId } = validatedData.data

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
    revalidatePath(`/application/check-in`)
  } catch {
    return { message: 'Could not check out' }
  }
}

export const checkInEmployee = async (data: unknown) => {
  const validatedData = checkInEmployeeSchema.safeParse(data)

  if (!validatedData.success) {
    return { message: 'Invalid input. Please try again.' }
  }

  const { memberId } = validatedData.data

  const activeMember = await getActiveMember()

  const { organizationId } = activeMember

  const checkedIn = await checkIfCheckedInAlready(organizationId, memberId)

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
          connect: { id: organizationId },
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
    revalidatePath(`/application/check-in`)
  } catch {
    return { message: 'Could not check in' }
  }
}

//need validation
export const searchOrgMember = async (data: unknown) => {
  const validatedData = searchOrgMemberSchema.safeParse(data)

  if (!validatedData.success) {
    return { success: false, message: 'Invalid Input, try again' }
  }

  const { employeeName } = validatedData.data

  const activeMember = await getActiveMember()

  const { organizationId } = activeMember

  if (activeMember?.organizationId !== organizationId) {
    return { success: false, message: 'Not authorized' }
  }

  try {
    const members = await prisma.member.findMany({
      where: {
        organizationId,
        user: {
          name: {
            contains: employeeName,
            mode: 'insensitive',
          },
        },
      },
      select: memberWithUserSelect,
    })

    return { success: true, data: members }
  } catch {
    return { success: false, message: 'Something went wrong please try again' }
  }
}

export const startBreak = async (data: unknown) => {
  const validatedData = startBreakSchema.safeParse(data)

  if (!validatedData.success) {
    return { message: 'Invalid input. Please try again.' }
  }

  const { attendanceId } = validatedData.data

  const alreadyOnBreak = await checkIfOnBreak(attendanceId)

  if (alreadyOnBreak) {
    return { message: 'Already on break' }
  }

  const pause = await createBreak(attendanceId)

  if (!pause) {
    return { message: 'Could not start break' }
  }

  revalidatePath(`/application/check-in`)
}

export const stopBreak = async (data: unknown) => {
  const validatedData = stopBreakSchema.safeParse(data)

  if (!validatedData.success) {
    return { message: 'Invalid input. Please try again.' }
  }

  const { breakId } = validatedData.data

  const pause = await editBreakToDone(breakId)

  if (!pause) {
    return { message: 'Could not stop break' }
  }

  revalidatePath(`/application/check-in`)
}
