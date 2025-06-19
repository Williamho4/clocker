import { getSchedulesForWeek } from "@/actions/schedule-actions";
import Schedule from "@/components/schedule";
import { Button } from "@/components/ui/button";
import { CardHeader, CardTitle } from "@/components/ui/card";
import { checkIfAdmin } from "@/lib/server-utils";
import { getISOWeek, getISOWeeksInYear, getISOWeekYear } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

type PageProps = {
  params: Promise<{ orgId: string }>;
  searchParams: Promise<{ week: number; year: number }>;
};
export default async function Page({ params, searchParams }: PageProps) {
  await checkIfAdmin();

  const { orgId } = await params;
  let { week, year } = await searchParams;

  if (!week || !year) {
    const now = new Date();
    const week = getISOWeek(now);
    const year = getISOWeekYear(now);
    redirect(
      `/application/${(await params).orgId}/scheduler?week=${week}&year=${year}`
    );
  }

  week = Number(week);
  year = Number(year);

  const schedules = await getSchedulesForWeek(week, year, orgId);

  const currentDate = new Date();
  const currentWeek = getISOWeek(currentDate);
  const currentYear = getISOWeekYear(currentDate);

  const weeksInYear = getISOWeeksInYear(new Date(year, 0, 1));

  let prevWeek = week - 1;
  let prevYear = year;
  if (prevWeek < 1) {
    prevYear -= 1;
    prevWeek = getISOWeeksInYear(new Date(prevYear, 0, 1));
  }

  let nextWeek = week + 1;
  let nextYear = year;
  if (nextWeek > weeksInYear) {
    nextYear += 1;
    nextWeek = 1;
  }

  return (
    <main className="w-full 2xl:w-[90%] xl:mx-auto h-full  p-4 overflow-y-auto scrollbar-clean ">
      <CardHeader className="bg-white rounded-xl p-4 mb-4 shadow-md border  ">
        <div className="flex flex-col gap-5 lg:flex-row lg:justify-between lg:items-center">
          <div>
            <CardTitle className="text-xl">
              Week {week} of {year}
            </CardTitle>
            <p className="text-sm text-gray-600 mt-1">
              10 shifts scheduled • 8 employees
            </p>
          </div>
          <div className="flex gap-2">
            <Link
              href={`/application/${orgId}/scheduler?week=${prevWeek}&year=${prevYear}`}
            >
              <Button>
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
            </Link>
            <Link
              href={`/application/${orgId}/scheduler?week=${currentWeek}&year=${currentYear}`}
            >
              <Button>This Week</Button>
            </Link>
            <Link
              href={`/application/${orgId}/scheduler?week=${nextWeek}&year=${nextYear}`}
            >
              <Button>
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </CardHeader>
      <Schedule schedules={schedules} week={week} year={year} orgId={orgId} />
    </main>
  );
}
