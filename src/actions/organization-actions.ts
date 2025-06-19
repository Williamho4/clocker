"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import prisma from "@/lib/db";
import {
  MemberWithUser,
  memberWithUserSelect,
} from "@/lib/prisma/member/select";

export const getAllColleagues = async (): Promise<MemberWithUser[]> => {
  const activeMember = await auth.api.getActiveMember({
    headers: await headers(),
  });

  if (!activeMember) {
    return [];
  }

  try {
    const colleagues = await prisma.member.findMany({
      where: {
        organizationId: activeMember.organizationId,
        id: {
          not: activeMember.id,
        },
      },
      select: memberWithUserSelect,
    });

    return colleagues;
  } catch {
    return [];
  }
};
