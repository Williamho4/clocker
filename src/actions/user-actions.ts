'use server'

import { auth } from '@/lib/auth'
import prisma from '@/lib/db'
import { headers } from 'next/headers'

export async function getAllUserShifts() {
  const activeMember = await auth.api.getActiveMember({
    headers: await headers(),
  })

  if (!activeMember) {
    return {
      message: 'Not authorized',
    }
  }

  const shifts = await prisma.shift.findMany({
    where: {
      userId: activeMember.user.id,
    },
  })

  return shifts
}
