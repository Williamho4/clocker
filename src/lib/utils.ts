import { clsx, type ClassValue } from "clsx";
import {
  differenceInMinutes,
  endOfISOWeek,
  format,
  intervalToDuration,
  setISOWeek,
  startOfISOWeek,
} from "date-fns";
import { twMerge } from "tailwind-merge";
import { ScheduleWithShifts } from "./prisma/schedule/select";
import { authClient } from "./auth-client";
import { fromZonedTime, toZonedTime } from "date-fns-tz";
import { DISPLAY_TIMEZONE } from "./constants";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function combineDateAndTime(date: Date, time: string): Date {
  const [hours, minutes] = time.split(":").map(Number);

  const localDateTime = new Date(date); // will hold local visual date

  localDateTime.setHours(hours);
  localDateTime.setMinutes(minutes);
  localDateTime.setSeconds(0);
  localDateTime.setMilliseconds(0);

  // interpret the local time in your timezone, then convert to UTC
  return fromZonedTime(localDateTime, DISPLAY_TIMEZONE);
}

export const countTotalHoursForDay = (schedule: ScheduleWithShifts) => {
  let totalHours = 0;
  let totalMinutes = 0;

  schedule.shifts.forEach((shift) => {
    const duration = intervalToDuration({
      start: new Date(shift.startTime!),
      end: new Date(shift.endTime!),
    });

    totalHours += duration.hours || 0;
    totalMinutes += duration.minutes || 0;
  });

  totalHours += Math.floor(totalMinutes / 60);
  totalMinutes = totalMinutes % 60;

  return totalHours;
};

export const countTotalWorkersForDay = (schedule: ScheduleWithShifts) => {
  let employees = 0;
  const employeeIds: string[] = [];

  schedule.shifts.forEach((shift) => {
    if (employeeIds.includes(shift.memberId)) {
      return;
    }

    employeeIds.push(shift.memberId);

    employees += 1;
  });

  return employees;
};

export const weekToDates = async (week: number, year: number) => {
  const janFirst = new Date(year, 0, 4);

  const dateInWeek = setISOWeek(janFirst, week);

  const startDate = startOfISOWeek(dateInWeek);
  const endDate = endOfISOWeek(dateInWeek);

  return [
    fromZonedTime(startDate, DISPLAY_TIMEZONE),
    fromZonedTime(endDate, DISPLAY_TIMEZONE),
  ];
};

export const getDateDiffrenceInHours = (startDate: Date, endDate: Date) => {
  const minutes = differenceInMinutes(endDate, startDate);
  const hours = minutes / 60;

  return Math.round(hours * 10) / 10;
};

export const alreadyMember = async (email: string) => {
  const { data } = await authClient.organization.getFullOrganization();

  if (!data?.members) {
    return;
  }

  const exists = data.members.some((member) => member.user.email === email);

  if (exists) {
    return true;
  }
};

export const formatToTimeZoneAndFormat = (date: Date, formatType: string) => {
  const timeZoneFormattedDate = toZonedTime(date, DISPLAY_TIMEZONE);

  return format(timeZoneFormattedDate, formatType);
};

export const checkIfSameDate = (date1: Date, date2: Date) => {
  return (
    format(toZonedTime(date1, DISPLAY_TIMEZONE), "yyyy-MM-dd") ===
    format(toZonedTime(date2, DISPLAY_TIMEZONE), "yyyy-MM-dd")
  );
};
