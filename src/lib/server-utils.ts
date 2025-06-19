"use server";

import { headers } from "next/headers";
import { auth } from "./auth";
import prisma from "./db";
import { addHours, subHours } from "date-fns";
import { redirect } from "next/navigation";

export async function checkIfCheckedInAlready(orgId: string, memberId: string) {
  const checkIfCheckedInAlready = await prisma.attendance.findFirst({
    where: {
      member: {
        id: memberId,
      },
      status: "CHECKED_IN",
      organization: {
        id: orgId,
      },
    },
  });

  return checkIfCheckedInAlready;
}

export async function checkIfShiftExistForAttendance(memberId: string) {
  try {
    const member = await prisma.member.findUnique({
      where: { id: memberId },
      select: { userId: true },
    });

    if (!member) {
      throw new Error("Member not found");
    }

    const shift = await prisma.shift.findFirst({
      where: {
        startTime: {
          gte: subHours(new Date(), 1),
          lte: addHours(new Date(), 1),
        },
        userId: member.userId,
      },
    });
    return shift;
  } catch {
    return null;
  }
}

export async function checkIfOnBreak(attendanceId: string) {
  const alreadyOnBreak = await prisma.break.findFirst({
    where: {
      attendanceId,
      status: "PENDING",
    },
  });

  return alreadyOnBreak;
}

export async function createBreak(attendanceId: string) {
  try {
    const pause = await prisma.break.create({
      data: {
        startTime: new Date(),
        attendance: {
          connect: { id: attendanceId },
        },
        status: "PENDING",
      },
    });

    return pause;
  } catch {
    return null;
  }
}

export async function editBreakToDone(breakId: string) {
  try {
    const pause = await prisma.break.update({
      where: {
        id: breakId,
      },
      data: {
        endTime: new Date(),
        status: "DONE",
      },
    });

    return pause;
  } catch {
    return null;
  }
}

export const checkIfAdmin = async () => {
  const activeMember = await auth.api.getActiveMember({
    headers: await headers(),
  });

  if (!activeMember) {
    redirect("/application/start");
  }

  if (activeMember.role === "member") {
    redirect("/application");
  }
};
