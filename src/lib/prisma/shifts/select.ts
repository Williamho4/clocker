import { Prisma } from '@prisma/client'

export const completedShiftsSelect = {
  id: true,
  status: true,
  checkInTime: true,
  checkOutTime: true,
  breaks: true,
  member: {
    include: {
      user: true,
    },
  },
  shift: true,
} satisfies Prisma.AttendanceSelect

export type completedShifts = Prisma.AttendanceGetPayload<{
  select: typeof completedShiftsSelect
}>
