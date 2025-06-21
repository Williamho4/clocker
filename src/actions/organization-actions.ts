'use server'

import prisma from '@/lib/db'
import { memberWithUserSelect } from '@/lib/prisma/member/select'
import { getActiveMember } from '@/lib/server-utils'

export const getAllColleagues = async () => {
  const activeMember = await getActiveMember()

  const { organizationId } = activeMember

  try {
    const colleagues = await prisma.member.findMany({
      where: {
        organizationId,
        id: {
          not: activeMember.id,
        },
      },
      select: memberWithUserSelect,
    })

    return { success: true, data: colleagues }
  } catch {
    return { success: false, message: 'Something went wrong, try again' }
  }
}
