'use server'

import prisma from './db'

export async function checkIfCheckedInAlready(orgId: string, memberId: string) {
  const checkIfCheckedInAlready = await prisma.attendance.findFirst({
    where: {
      member: {
        id: memberId,
      },
      status: 'CHECKED_IN',
      organization: {
        id: orgId,
      },
    },
  })

  return checkIfCheckedInAlready
}
