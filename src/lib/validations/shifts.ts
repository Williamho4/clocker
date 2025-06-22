import { z } from "zod";

export const getUpcomingShiftsForTimeSpanSchema = z.object({
  startDate: z.date(),
  endDate: z.date(),
});
