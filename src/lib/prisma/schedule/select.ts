import { Prisma } from '@prisma/client'

export const scheduleSelect = {
  shifts: {
    orderBy: [{ startTime: 'asc' }, { endTime: 'asc' }],
    include: {
      user: {
        select: {
          firstName: true,
          lastName: true,
        },
      },
    },
  },
} satisfies Prisma.ScheduleInclude

export type ScheduleWithShifts = Prisma.ScheduleGetPayload<{
  include: typeof scheduleSelect
}>
