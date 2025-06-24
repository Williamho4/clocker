import { User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import AddShiftBtn from "./add-shift-btn";
import { addDays, format, startOfDay, startOfWeek } from "date-fns";
import { Weekday } from "@/lib/types";
import {
  checkIfSameDate,
  cn,
  countTotalHoursForDay,
  countTotalWorkersForDay,
  weekToDates,
} from "@/lib/utils";
import Shift from "./shift";
import { ScheduleWithShifts } from "@/lib/prisma/schedule/select";
import { getSchedulesForWeek } from "@/actions/schedule-actions";
import { toZonedTime } from "date-fns-tz";
import { DISPLAY_TIMEZONE } from "@/lib/constants";

type ScheduleMakerProps = {
  week: number;
  year: number;
};

export default async function Schedule({ week, year }: ScheduleMakerProps) {
  const selectedDate = await weekToDates(week, year);
  const weekStart = startOfWeek(selectedDate[0], { weekStartsOn: 1 });
  const todaysDate = startOfDay(new Date());

  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const date = addDays(weekStart, i);
    return {
      date: toZonedTime(startOfDay(date), DISPLAY_TIMEZONE),
      label: format(date, "MMMM d"),
      dayName: format(date, "EEEE"),
      iso: format(date, "yyyy-MM-dd"),
    };
  });

  const { data: schedules } = await getSchedulesForWeek({
    week,
    year,
  });

  return (
    <>
      <section className="space-y-5">
        <div className="grid grid-cols-1 s:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-7 gap-3">
          {schedules ? (
            weekDays.map((day) => {
              const scheduleForDay: ScheduleWithShifts | undefined =
                schedules.find((schedule) =>
                  checkIfSameDate(schedule.date, day.date)
                );

              return (
                <Card
                  key={day.iso}
                  className={cn("min-h-50 lg:min-h-140 shadow-sm", {
                    "ring-2 ring-blue-400":
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
                        .filter((shift) => {
                          const shiftDay = format(
                            toZonedTime(shift.startTime, DISPLAY_TIMEZONE),
                            "yyyy-MM-dd"
                          );
                          const currentDay = format(day.date, "yyyy-MM-dd");
                          return shiftDay === currentDay;
                        })
                        .map((shift) => (
                          <Shift key={shift.id} shiftData={shift} />
                        ))}
                  </CardContent>
                </Card>
              );
            })
          ) : (
            <p>Could not load schedules</p>
          )}
        </div>
      </section>
    </>
  );
}

type ShiftStatsProps = {
  day: Weekday;
  todaysDate: Date;
  schedulesForDay: ScheduleWithShifts | null;
};

const ShiftStats = ({ schedulesForDay, day, todaysDate }: ShiftStatsProps) => {
  let hours = 0;
  let employess = 0;

  if (schedulesForDay) {
    hours = countTotalHoursForDay(schedulesForDay);
    employess = countTotalWorkersForDay(schedulesForDay);
  }

  return (
    <div className="space-y-1">
      <div className="flex justify-between">
        <p
          className={cn("", {
            "text-blue-500": todaysDate.getTime() === day.date.getTime(),
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
  );
};
