import { clsx, type ClassValue } from 'clsx'
import {
  differenceInMinutes,
  endOfISOWeek,
  format,
  intervalToDuration,
  setISOWeek,
  startOfISOWeek,
} from 'date-fns'
import { twMerge } from 'tailwind-merge'
import { ScheduleWithShifts } from './prisma/schedule/select'
import { authClient } from './auth-client'

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

export const countTotalHoursForDay = (schedule: ScheduleWithShifts) => {
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

export const countTotalWorkersForDay = (schedule: ScheduleWithShifts) => {
  let employees = 0
  const employeeIds: string[] = []

  schedule.shifts.forEach((shift) => {
    if (employeeIds.includes(shift.memberId)) {
      return
    }

    employeeIds.push(shift.memberId)

    employees += 1
  })

  return employees
}

export const weekToDates = async (week: number, year: number) => {
  const janFirst = new Date(year, 0, 4)

  const dateInWeek = setISOWeek(janFirst, week)

  const startDate = startOfISOWeek(dateInWeek)
  const endDate = endOfISOWeek(dateInWeek)

  return [startDate, endDate]
}

export const getDateDiffrenceInHours = (startDate: Date, endDate: Date) => {
  const minutes = differenceInMinutes(endDate, startDate)
  const hours = minutes / 60

  return Math.round(hours * 10) / 10
}

export const alreadyMember = async (email: string) => {
  const { data } = await authClient.organization.getFullOrganization()

  if (!data?.members) {
    return
  }

  const exists = data.members.some((member) => member.user.email === email)

  if (exists) {
    return true
  }
}
