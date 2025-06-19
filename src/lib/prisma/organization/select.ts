import { Prisma } from "@prisma/client";

export const organizationWithMemberRoleSelect = {
  id: true,
  name: true,
  slug: true,
  logo: true,
  members: {
    where: {
      userId: undefined as unknown as string, // fill dynamically
    },
    select: {
      role: true,
    },
  },
} satisfies Prisma.OrganizationSelect;

export type OrganizationWithMemberRole = Prisma.OrganizationGetPayload<{
  select: typeof organizationWithMemberRoleSelect;
}>;
