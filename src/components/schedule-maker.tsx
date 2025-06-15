'use client'

import { ChevronLeft, ChevronRight, Trash2, User } from 'lucide-react'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import AddShiftBtn from './add-shift-btn'
import {
  addDays,
  addWeeks,
  format,
  isSameDay,
  startOfDay,
  startOfWeek,
  subWeeks,
} from 'date-fns'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { ScheduleAndShifts, Weekday } from '@/lib/types'
import {
  cn,
  countTotalHoursForDay,
  countTotalWorkersForDay,
  formatToLocalTime,
} from '@/lib/utils'
import Shift from './shift'
import { authClient } from '@/lib/auth-client'
import { ActiveOrganization } from '@/lib/auth-types'

export default function ScheduleMaker() {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [schedules, setSchedules] = useState<ScheduleAndShifts[] | []>([])
  const [reRender, setReRender] = useState(false)

  const { data: activeOrganization, isPending: orgLoading } =
    authClient.useActiveOrganization()
  const { data: session, isPending: sessionLoading } = authClient.useSession()

  const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 })
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

  useEffect(() => {
    const fetchSchedules = async () => {
      const res = await fetch(
        `/api/schedules/?start=${weekStart.toISOString()}&end=${weekDays[6].date.toISOString()}&orgId=${
          activeOrganization?.id
        }`
      )
      const data = await res.json()

      setSchedules(data)
    }

    fetchSchedules()
  }, [selectedDate, activeOrganization?.id, reRender])

  const goToPreviousWeek = () => {
    setSelectedDate((prev) => subWeeks(prev, 1))
  }

  const goToNextWeek = () => {
    setSelectedDate((prev) => addWeeks(prev, 1))
  }

  return (
    <>
      {orgLoading && sessionLoading ? (
        <p>Loading</p>
      ) : (
        <section className="space-y-5">
          <ScheduleMakerHeader
            setSelectedDate={setSelectedDate}
            weekStart={weekStart}
            goToNextWeek={goToNextWeek}
            goToPreviousWeek={goToPreviousWeek}
          />
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
                        schedulesForDay={
                          schedulesForDay ? schedulesForDay : null
                        }
                        day={day}
                        todaysDate={todaysDate}
                      />
                    </CardTitle>
                    <AddShiftBtn
                      activeOrganization={
                        activeOrganization as ActiveOrganization
                      }
                      setReRender={setReRender}
                      session={session}
                      selectedDay={day.date}
                    />
                  </CardHeader>
                  <CardContent className="flex flex-col">
                    {schedulesForDay &&
                      schedulesForDay.shifts.map((shift) => (
                        <Shift
                          setReRender={setReRender}
                          key={shift.id}
                          shiftData={shift}
                        />
                      ))}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </section>
      )}
    </>
  )
}

type ScheduleMakerHeaderProps = {
  setSelectedDate: Dispatch<SetStateAction<Date>>
  weekStart: Date
  goToPreviousWeek: () => void
  goToNextWeek: () => void
}

const ScheduleMakerHeader = ({
  setSelectedDate,
  weekStart,
  goToPreviousWeek,
  goToNextWeek,
}: ScheduleMakerHeaderProps) => {
  return (
    <CardHeader className="bg-white rounded-xl p-4">
      <div className="flex flex-col gap-5 lg:flex-row lg:justify-between lg:items-center">
        <div>
          <CardTitle className="text-xl">
            <span>
              {format(weekStart, 'MMMM d')} –{' '}
              {format(addWeeks(weekStart, 1), 'MMMM d')}
            </span>
          </CardTitle>
          <p className="text-sm text-gray-600 mt-1">
            10 shifts scheduled • 8 employees
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={goToPreviousWeek}>
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>
          <Button onClick={() => setSelectedDate(new Date())}>This Week</Button>
          <Button onClick={goToNextWeek}>
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </CardHeader>
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
