import { clsx, type ClassValue } from 'clsx'
import {
  endOfISOWeek,
  format,
  intervalToDuration,
  setISOWeek,
  startOfISOWeek,
} from 'date-fns'
import { toZonedTime } from 'date-fns-tz'
import { twMerge } from 'tailwind-merge'
import { ScheduleAndShifts } from './types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function dateFormatter(date: Date) {
  return format(date, 'MMMM d')
}

export function combineDateAndTime(date: Date, time: string): Date {
  const [hours, minutes] = time.split(':').map(Number)
  const combined = new Date(date)

  combined.setHours(hours)
  combined.setMinutes(minutes)
  combined.setSeconds(0)
  combined.setMilliseconds(0)

  return combined
}

export const countTotalHoursForDay = (schedule: ScheduleAndShifts) => {
  let totalHours = 0
  let totalMinutes = 0

  schedule.shifts.forEach((shift) => {
    const duration = intervalToDuration({
      start: new Date(shift.startTime!),
      end: new Date(shift.endTime!),
    })

    totalHours += duration.hours || 0
    totalMinutes += duration.minutes || 0
  })

  totalHours += Math.floor(totalMinutes / 60)
  totalMinutes = totalMinutes % 60

  return totalHours
}

export const countTotalWorkersForDay = (schedule: ScheduleAndShifts) => {
  let employees = 0
  let employeeIds: string[] = []

  schedule.shifts.forEach((shift) => {
    if (employeeIds.includes(shift.userId)) {
      return
    }

    employeeIds.push(shift.userId)

    employees += 1
  })

  return employees
}

export const weekToDates = async (week: number, year: number) => {
  let janFirst = new Date(year, 0, 4)

  const dateInWeek = setISOWeek(janFirst, week)

  const startDate = startOfISOWeek(dateInWeek)
  const endDate = endOfISOWeek(dateInWeek)

  return [startDate, endDate]
}
