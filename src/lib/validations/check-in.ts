import { z } from 'zod'

export const checkOutEmployeeSchema = z.object({
  attendanceId: z.string(),
})

export const checkInEmployeeSchema = z.object({
  memberId: z.string(),
})

export const searchOrgMemberSchema = z.object({
  employeeName: z.string(),
})

export const startBreakSchema = z.object({
  attendanceId: z.string(),
})

export const stopBreakSchema = z.object({
  breakId: z.string(),
})
