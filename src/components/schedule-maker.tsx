import { User } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import AddShiftBtn from './add-shift-btn'
import { addDays, format, isSameDay, startOfDay, startOfWeek } from 'date-fns'
import { ScheduleAndShifts, Weekday } from '@/lib/types'
import {
  cn,
  countTotalHoursForDay,
  countTotalWorkersForDay,
  weekToDates,
} from '@/lib/utils'
import Shift from './shift'

type ScheduleMakerProps = {
  schedules: ScheduleAndShifts[]
  week: number
  year: number
  orgId: string
}

export default async function ScheduleMaker({
  schedules,
  week,
  year,
  orgId,
}: ScheduleMakerProps) {
  const selectedDate = await weekToDates(week, year)
  const weekStart = startOfWeek(selectedDate[0], { weekStartsOn: 1 })
  const todaysDate = startOfDay(new Date())

  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const date = addDays(weekStart, i)
    return {
      date, // raw Date object
      label: format(date, 'MMMM d'), // "June 12"
      dayName: format(date, 'EEEE'), // "Thursday"
      iso: format(date, 'yyyy-MM-dd'), // "2025-06-12"
    }
  })

  return (
    <>
      <section className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-7 gap-3">
          {weekDays.map((day) => {
            const schedulesForDay: ScheduleAndShifts | undefined =
              schedules.find((schedule) => isSameDay(schedule.date, day.date))

            return (
              <Card
                key={day.iso}
                className={cn('min-h-50 lg:min-h-140 shadow-sm', {
                  'ring-2 ring-blue-400':
                    todaysDate.getTime() === day.date.getTime(),
                })}
              >
                <CardHeader>
                  <CardTitle>
                    <ShiftStats
                      schedulesForDay={schedulesForDay ? schedulesForDay : null}
                      day={day}
                      todaysDate={todaysDate}
                    />
                  </CardTitle>
                  <AddShiftBtn orgId={orgId} selectedDay={day.date} />
                </CardHeader>
                <CardContent className="flex flex-col">
                  {schedulesForDay &&
                    schedulesForDay.shifts.map((shift) => (
                      <Shift key={shift.id} shiftData={shift} />
                    ))}
                </CardContent>
              </Card>
            )
          })}
        </div>
      </section>
    </>
  )
}

type ShiftStatsProps = {
  day: Weekday
  todaysDate: Date
  schedulesForDay: ScheduleAndShifts | null
}

const ShiftStats = ({ schedulesForDay, day, todaysDate }: ShiftStatsProps) => {
  let hours = 0
  let employess = 0

  if (schedulesForDay) {
    hours = countTotalHoursForDay(schedulesForDay)
    employess = countTotalWorkersForDay(schedulesForDay)
  }

  return (
    <div className="space-y-1">
      <div className="flex justify-between">
        <p
          className={cn('', {
            'text-blue-500': todaysDate.getTime() === day.date.getTime(),
          })}
        >
          {day.dayName}
        </p>
        <div className="flex items-center gap-1">
          <User size={14}></User>
          <p>{employess}</p>
        </div>
      </div>
      <p className="text-sm font-thin">{day.label}</p>
      <p className="text-sm font-light">{hours} Hours</p>
    </div>
  )
}
