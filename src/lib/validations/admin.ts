import { z } from 'zod'

export const getCompletedShiftsSchema = z.object({
  date: z.date(),
})
