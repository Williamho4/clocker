import { getActiveMember } from "@/lib/server-utils";
import prisma from "@/lib/db";
import { getUpcomingShiftsForTimeSpanSchema } from "@/lib/validations/shifts";

export async function getUpcomingShiftsForTimeSpan(data: unknown) {
  const activeMember = await getActiveMember();

  const validatedData = getUpcomingShiftsForTimeSpanSchema.safeParse(data);

  if (!validatedData.success) {
    return { message: "Invalid input. Please try again." };
  }

  const { startDate, endDate } = validatedData.data;

  try {
    const shifts = await prisma.shift.findMany({
      where: {
        memberId: activeMember.id,
        schedule: {
          organizationId: activeMember.organizationId,
        },
        startTime: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: {
        startTime: "asc",
      },
    });

    return { success: true, data: shifts };
  } catch {
    return { success: false, message: "Could not get shifts" };
  }
}
