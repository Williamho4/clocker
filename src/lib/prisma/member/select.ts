import { Prisma } from '@prisma/client'

export const memberWithUserSelect = {
  id: true,
  organizationId: true,
  userId: true,
  user: {
    select: {
      id: true,
      name: true,
      email: true,
      firstName: true,
      lastName: true,
    },
  },
} satisfies Prisma.MemberSelect

export type MemberWithUser = Prisma.MemberGetPayload<{
  select: typeof memberWithUserSelect
}>
