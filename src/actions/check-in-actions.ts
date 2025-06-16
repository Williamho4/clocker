'use server'

import { auth } from '@/lib/auth'
import prisma from '@/lib/db'
import { checkIfCheckedInAlready } from '@/lib/server-utils'
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
      },
    })

    return attendances
  } catch (error) {
    console.log(error)
    return []
  }
}

export const checkOutEmployee = async (attendanceId: string, orgId: string) => {
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
  } catch (error) {
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
      },
    })
    revalidatePath(`/app/${orgId}/check-in`)
  } catch (error) {
    return { message: 'Could not check in' }
  }
}

export const searchOrgMember = async (orgId: string, employeeName: string) => {
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
        user: {
          name: {
            contains: employeeName,
            mode: 'insensitive',
          },
        },
        organizationId: orgId,
      },
      include: {
        user: true,
      },
    })

    return members
  } catch (error) {
    console.error('Failed to search members:', error)
    return []
  }
}

export const startBreak = async (attendanceId: string, orgId: string) => {
  const alreadyOnBreak = await prisma.break.findFirst({
    where: {
      attendanceId,
    },
  })

  if (alreadyOnBreak) {
    return { message: 'Already on break' }
  }

  try {
    await prisma.break.create({
      data: {
        startTime: new Date(),
        attendance: {
          connect: { id: attendanceId },
        },
        status: 'PENDING',
      },
    })

    revalidatePath(`/app/${orgId}/check-in`)
  } catch (error) {
    return { message: 'Could not start break' }
  }
}

export const stopBreak = async (breakId: string, orgId: string) => {
  try {
    await prisma.break.update({
      where: {
        id: breakId,
      },
      data: {
        endTime: new Date(),
        status: 'DONE',
      },
    })
    revalidatePath(`/app/${orgId}/check-in`)
  } catch (error) {
    return { message: 'Could not stop break' }
  }
}
