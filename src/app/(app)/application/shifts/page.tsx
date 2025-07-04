import { getAllColleagues } from "@/actions/organization-actions";
import { getUpcomingShiftsForTimeSpan } from "@/actions/shifts";
import {
  getTotalHoursPlannedThisWeek,
  getTotalHoursWorkedInTimeSpan,
  getTotalUpcomingShifts,
} from "@/actions/user-actions";
import ShiftCard from "@/components/shift-card";
import { auth } from "@/lib/auth";
import { endOfMonth, startOfMonth } from "date-fns";
import { Calendar, Clock, User } from "lucide-react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function Page() {
  const activeMember = await auth.api.getActiveMember({
    headers: await headers(),
  });

  if (!activeMember) {
    redirect("/application/start");
  }

  //Get all shifts this month
  const { data: shifts } = await getUpcomingShiftsForTimeSpan({
    startDate: startOfMonth(new Date()),
    endDate: endOfMonth(new Date()),
  });

  console.log(startOfMonth(new Date()));
  const { data: colleagues } = await getAllColleagues();

  return (
    <main className="w-full 2xl:w-[90%] xl:m-auto h-full p-4 space-y-6 overflow-y-auto scrollbar-clean">
      <ShiftStats />
      <div className="grid gap-5 grid-cols-1 md:grid-cols-2 lg:grid-cols-3  ">
        {shifts && colleagues ? (
          shifts.map((shift) => (
            <ShiftCard
              key={shift.id}
              shiftData={shift}
              colleagues={colleagues}
            />
          ))
        ) : (
          <p>Could not load shifts</p>
        )}
      </div>
    </main>
  );
}

const ShiftStats = async () => {
  const totalHoursScheduled = await getTotalHoursPlannedThisWeek();
  const totalUpcomingShifts = await getTotalUpcomingShifts();
  const totalHoursWorkedThisMonth = await getTotalHoursWorkedInTimeSpan({
    startDate: startOfMonth(new Date()),
    endDate: endOfMonth(new Date()),
  });

  return (
    <div className="grid gap-5 grid-cols-1 md:grid-cols-3 ">
      <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-blue-600 text-sm font-medium mb-1">
              Total Hours This Week
            </p>
            <p className="text-3xl font-bold text-blue-900">
              {totalHoursScheduled ? totalHoursScheduled : "0"}
            </p>
            <p className="text-blue-600 text-xs">Hours scheduled</p>
          </div>
          <div className="bg-blue-200 p-3 rounded-full">
            <Clock className="h-6 w-6 text-blue-700" />
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border border-green-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-green-600 text-sm font-medium mb-1">
              Upcoming Shifts
            </p>
            <p className="text-3xl font-bold text-green-900">
              {totalUpcomingShifts}
            </p>
            <p className="text-green-600 text-xs">Shifts remaining</p>
          </div>
          <div className="bg-green-200 p-3 rounded-full">
            <Calendar className="h-6 w-6 text-green-700" />
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl border border-purple-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-purple-600 text-sm font-medium mb-1">
              This Month
            </p>
            <p className="text-3xl font-bold text-purple-900">
              {totalHoursWorkedThisMonth}
            </p>
            <p className="text-purple-600 text-xs">Total hours worked</p>
          </div>
          <div className="bg-purple-200 p-3 rounded-full">
            <User className="h-6 w-6 text-purple-700" />
          </div>
        </div>
      </div>
    </div>
  );
};
