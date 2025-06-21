import { z } from 'zod'

export const createShiftSchema = z.object({
  shiftStartDate: z.date(),
  shiftEndDate: z.date(),
  employeeId: z.string(),
})

export const deleteShiftSchema = z.object({
  shiftId: z.string(),
})

export const getSchedulesForWeekSchema = z.object({
  week: z.number(),
  year: z.number(),
})
