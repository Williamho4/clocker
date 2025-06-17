import {
  getAllUserShifts,
  getTotalHoursPlannedThisWeek,
  getTotalHoursWorkedThisMonth,
  getTotalUpcomingShifts,
} from '@/actions/user-actions'
import ShiftCard from '@/components/shift-card'
import { Calendar, Clock, User } from 'lucide-react'

export default async function Page() {
  const shifts = await getAllUserShifts()

  return (
    <main className="w-full 2xl:w-[90%] xl:m-auto h-full  p-4 space-y-6 ">
      <ShiftStats />
      <div className="grid gap-5 grid-cols-1 md:grid-cols-2 lg:grid-cols-3  ">
        {shifts.map((shift) => (
          <ShiftCard key={shift.id} shiftData={shift} />
        ))}
      </div>
    </main>
  )
}

const ShiftStats = async () => {
  const totalHoursScheduled = await getTotalHoursPlannedThisWeek()
  const totalUpcomingShifts = await getTotalUpcomingShifts()
  const totalHoursWorkedThisMonth = await getTotalHoursWorkedThisMonth()

  return (
    <div className="grid gap-5 grid-cols-3 ">
      <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-blue-600 text-sm font-medium mb-1">
              Total Hours This Week
            </p>
            <p className="text-3xl font-bold text-blue-900">
              {totalHoursScheduled ? totalHoursScheduled : '0'}
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
  )
}
