import { User } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import AddShiftBtn from './add-shift-btn'
import { addDays, isSameDay, startOfDay, startOfWeek } from 'date-fns'
import { Weekday } from '@/lib/types'
import {
  cn,
  countTotalHoursForDay,
  countTotalWorkersForDay,
  formatToTimeZoneAndFormat,
  weekToDates,
} from '@/lib/utils'
import Shift from './shift'
import { ScheduleWithShifts } from '@/lib/prisma/schedule/select'
import { getSchedulesForWeek } from '@/actions/schedule-actions'

type ScheduleMakerProps = {
  week: number
  year: number
}

export default async function Schedule({ week, year }: ScheduleMakerProps) {
  const selectedDate = await weekToDates(week, year)
  const weekStart = startOfWeek(selectedDate[0], { weekStartsOn: 1 })
  const todaysDate = startOfDay(new Date())

  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const date = addDays(weekStart, i)
    return {
      date, // raw Date object
      label: formatToTimeZoneAndFormat(date, 'MMMM d'), // "June 12"
      dayName: formatToTimeZoneAndFormat(date, 'EEEE'), // "Thursday"
      iso: formatToTimeZoneAndFormat(date, 'yyyy-MM-dd'), // "2025-06-12"
    }
  })

  const { data: schedules } = await getSchedulesForWeek({
    week,
    year,
  })

  return (
    <>
      <section className="space-y-5">
        <div className="grid grid-cols-1 s:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-7 gap-3">
          {schedules ? (
            weekDays.map((day) => {
              const scheduleForDay: ScheduleWithShifts | undefined =
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
                        schedulesForDay={scheduleForDay ? scheduleForDay : null}
                        day={day}
                        todaysDate={todaysDate}
                      />
                    </CardTitle>
                    <AddShiftBtn selectedDay={day.date} />
                  </CardHeader>
                  <CardContent className="flex flex-col">
                    {scheduleForDay &&
                      scheduleForDay.shifts
                        .filter((shift) => shift.startTime !== null)
                        .map((shift) => (
                          <Shift key={shift.id} shiftData={shift} />
                        ))}
                  </CardContent>
                </Card>
              )
            })
          ) : (
            <p>Could not load schedules</p>
          )}
        </div>
      </section>
    </>
  )
}

type ShiftStatsProps = {
  day: Weekday
  todaysDate: Date
  schedulesForDay: ScheduleWithShifts | null
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
