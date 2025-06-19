"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { scheduleSelect } from "@/lib/prisma/schedule/select";
import { weekToDates } from "@/lib/utils";
import { Organization, User } from "@prisma/client";
import {
  addDays,
  endOfDay,
  isLeapYear,
  startOfDay,
  startOfYear,
} from "date-fns";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

export const createShift = async (
  shiftStartDate: Date,
  shiftEndDate: Date,
  employeeId: User["id"],
  organizationId: Organization["id"]
) => {
  const activeMember = await auth.api.getActiveMember({
    headers: await headers(),
  });

  if (!activeMember || activeMember.role === "member") {
    return {
      message: "Not authorized",
    };
  }

  const checkIfSchedulesAlreadyCreated = await prisma.schedule.findFirst({
    where: {
      date: {
        gte: startOfDay(shiftStartDate),
        lte: endOfDay(shiftEndDate),
      },
      organizationId,
    },
  });

  if (!checkIfSchedulesAlreadyCreated) {
    const yearStartDate = startOfYear(shiftStartDate);
    const daysInYear = isLeapYear(yearStartDate) ? 366 : 365;

    const allDays = Array.from({ length: daysInYear }, (_, i) =>
      addDays(yearStartDate, i)
    );

    await Promise.all(
      allDays.map((date) =>
        prisma.schedule.create({
          data: {
            date,
            organizationId,
          },
        })
      )
    );
  }

  const schedule = await prisma.schedule.findUnique({
    where: {
      date_organizationId: {
        date: startOfDay(shiftStartDate),
        organizationId,
      },
    },
    select: {
      id: true,
    },
  });

  if (!schedule) throw new Error("Schedule not found");

  const fixedEndDate =
    shiftStartDate > shiftEndDate ? addDays(shiftEndDate, 1) : shiftEndDate;

  const employeeAlreadyHasShift = await prisma.shift.findFirst({
    where: {
      userId: employeeId,
      schedule: {
        organizationId,
      },
      startTime: {
        lt: fixedEndDate,
      },
      endTime: {
        gt: shiftStartDate,
      },
    },
  });

  if (employeeAlreadyHasShift) {
    return {
      message: "The employee already has a shift this time",
    };
  }

  try {
    await prisma.shift.create({
      data: {
        startTime: shiftStartDate,
        endTime: fixedEndDate,
        user: {
          connect: { id: employeeId },
        },
        schedule: {
          connect: { id: schedule.id },
        },
      },
    });

    revalidatePath(`/app/${organizationId}/scheduler`);
  } catch {
    return {
      message: "Something went wrong please try again",
    };
  }
};

export const deleteShift = async (shiftId: string) => {
  const activeMember = await auth.api.getActiveMember({
    headers: await headers(),
  });

  //change this
  const organization = await auth.api.getFullOrganization({
    headers: await headers(),
  });

  if (!activeMember || activeMember.role === "member") {
    return {
      message: "Not authorized",
    };
  }

  try {
    await prisma.shift.delete({
      where: {
        id: shiftId,
      },
    });
  } catch {
    return {
      message: "Could not delete shift",
    };
  }

  revalidatePath(`/app/${organization?.id}/scheduler`);
};

export const getSchedulesForWeek = async (
  week: number,
  year: number,
  orgId: string
) => {
  const dates = await weekToDates(week, year);

  const schedules = await prisma.schedule.findMany({
    where: {
      date: {
        gte: dates[0],
        lte: dates[1],
      },
      organizationId: orgId,
    },
    include: scheduleSelect,
  });

  return schedules;
};
