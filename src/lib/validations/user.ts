import { z } from "zod";

export const checkIfUserExistsSchema = z.object({
  email: z.string().email(),
});

export const createShiftChangeRequestSchema = z.object({
  colleagueId: z.string(),
  shiftId: z.string(),
});

export const getAllUserInvitesSchema = z.object({
  email: z.string().email(),
});

export const getTotalHoursWorkedInTimeSpanSchema = z.object({
  startDate: z.date(),
  endDate: z.date(),
});
