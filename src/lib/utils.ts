import { clsx, type ClassValue } from 'clsx'
import { format, intervalToDuration } from 'date-fns'
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

export function formatToLocalTime(schedules: ScheduleAndShifts[]) {
  const formattedSchedules = schedules.map((schedule) => {
    const localDate = toZonedTime(schedule.date, 'Europe/Paris')

    if (schedule.shifts) {
      const localShifts = schedule.shifts.map((shift) => ({
        ...shift,
        startTime: toZonedTime(shift.startTime, 'Europe/Paris'),
        endTime: toZonedTime(shift.endTime, 'Europe/Paris'),
      }))

      return {
        ...schedule,
        date: localDate,
        shifts: localShifts,
      }
    }

    return {
      ...schedule,
      date: localDate,
    }
  })

  return formattedSchedules
}

export const countTotalHoursForDay = (schedule: ScheduleAndShifts) => {
  let totalHours = 0
  let totalMinutes = 0

  schedule.shifts.forEach((shift) => {
    const duration = intervalToDuration({
      start: new Date(shift.startTime),
      end: new Date(shift.endTime),
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
