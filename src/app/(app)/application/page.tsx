import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Calendar, Clock, Mail, Phone, User } from "lucide-react";
import UserImage from "../../../components/user-image";
import { getUpcomingShiftsForTimeSpan } from "@/actions/shifts";
import { Shift as TShift } from "@prisma/client";
import {
  addDays,
  endOfWeek,
  getHours,
  startOfDay,
  startOfWeek,
} from "date-fns";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { getTotalHoursWorkedInTimeSpan } from "@/actions/user-actions";
import {
  formatToTimeZoneAndFormat,
  getDateDiffrenceInHours,
} from "@/lib/utils";

export default async function Page() {
  const activeMember = await auth.api.getActiveMember({
    headers: await headers(),
  });

  if (!activeMember) {
    redirect("/application/start");
  }

  //Get shifts for 7 next days
  const { data: shifts } = await getUpcomingShiftsForTimeSpan({
    startDate: startOfDay(new Date()),
    endDate: addDays(new Date(), 7),
  });

  const totalHoursWorkedThisWeek = await getTotalHoursWorkedInTimeSpan({
    startDate: startOfWeek(new Date(), { weekStartsOn: 1 }),
    endDate: endOfWeek(new Date(), { weekStartsOn: 1 }),
  });

  return (
    <main className="w-full h-full overflow-y-auto">
      <div className="flex flex-col lg:flex-row p-4 md:p-10 space-x-9 h-full">
        <section className="w-full lg:w-[65%] h-220 lg:h-full mb-6 lg:mb-0 grid grid-rows-[1fr_4fr] gap-5">
          <div className="grid lg:grid-cols-3 gap-3">
            <Card className="rounded-md">
              <CardContent className="flex items-center gap-4 ">
                <Calendar size={30} color="blue" />
                <div>
                  <p className="text-gray-500">Total Hours Worked This Week</p>
                  <p className="text-2xl font-bold">
                    {totalHoursWorkedThisWeek}
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card className="rounded-md">
              <CardContent className="flex items-center gap-4">
                <Clock size={30} color="green" />
                <div>
                  <p className="text-gray-500">Total Hours</p>
                  <p className="text-2xl font-bold">34.0</p>
                </div>
              </CardContent>
            </Card>
            <Card className="rounded-md">
              <CardContent className="flex items-center gap-4">
                <Clock size={30} color="purple" />
                <div>
                  <p className="text-gray-500">Total Hours</p>
                  <p className="text-2xl font-bold">34.0</p>
                </div>
              </CardContent>
            </Card>
          </div>
          <Card className="md:px-6 grid grid-rows-[auto_1fr] rounded-md h-full min-h-0">
            <CardHeader className="">
              <CardTitle>Upcoming Shifts</CardTitle>
              <CardDescription>
                Your scheduled shifts for the next 7 days
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 overflow-y-auto scrollbar-clean ">
              {shifts ? (
                shifts.map((shift) => <Shift key={shift.id} shift={shift} />)
              ) : (
                <p>Could not load shifts</p>
              )}
            </CardContent>
          </Card>
        </section>
        <section className="w-full lg:w-[35%] grid grid-rows-[10fr_4fr] gap-5 h-full">
          <Card className="rounded-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <User />
                <p className="text-2xl">Your Profile</p>
              </CardTitle>
            </CardHeader>
            <CardContent className="flex gap-4">
              <UserImage
                firstName="William"
                lastName="Ho"
                className="h-16 w-16"
              />
              <div>
                <p className="capitalize">{activeMember.user.name}</p>
                <div className=" text-sm">
                  <p className="flex items-center text-gray-600">
                    <Mail className="h-4 w-4 mr-2" />
                    {activeMember.user.email}
                  </p>
                  <p className="flex items-center text-gray-600">
                    <Phone className="h-4 w-4 mr-2" />
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="rounded-md">User</Card>
        </section>
      </div>
    </main>
  );
}

const Shift = ({ shift }: { shift: TShift }) => {
  function getTimeOfDay(
    date: Date
  ): "morning" | "afternoon" | "evening" | "night" {
    const hour = getHours(date);

    if (hour >= 5 && hour < 12) return "morning";
    if (hour >= 12 && hour < 17) return "afternoon";
    if (hour >= 17 && hour < 21) return "evening";
    return "night";
  }

  const totalHours = getDateDiffrenceInHours(shift.startTime, shift.endTime);

  return (
    <Card className="rounded-sm">
      <CardContent className="flex items-center">
        <div className="flex items-center gap-5">
          <div className="flex flex-col items-center">
            <p className="text-muted-foreground">
              {formatToTimeZoneAndFormat(shift.startTime, "iii")}
            </p>
            <p className="font-bold text-xl">
              {" "}
              {formatToTimeZoneAndFormat(shift.startTime, "d")}
            </p>
          </div>
          <div>
            <p className="capitalize">{getTimeOfDay(shift.startTime)} shift</p>

            <div className="flex gap-2">
              <Clock />
              <p className="text-muted-foreground">
                {formatToTimeZoneAndFormat(shift.startTime, "HH:mm")} -
                {formatToTimeZoneAndFormat(shift.endTime, "HH:mm")}
              </p>
            </div>
          </div>
        </div>
        <Badge
          variant="secondary"
          className="bg-gray-200 text-gray-900 ml-auto"
        >
          {totalHours} Hours
        </Badge>
      </CardContent>
    </Card>
  );
};
