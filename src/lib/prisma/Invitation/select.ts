import { Prisma } from '@prisma/client'

export const invitationSelect = {
  id: true,
  email: true,
  status: true,
  role: true,
  expiresAt: true,
  organization: {
    select: {
      name: true,
    },
  },
} satisfies Prisma.InvitationSelect

export type InvitationWithOrg = Prisma.InvitationGetPayload<{
  select: typeof invitationSelect
}>
