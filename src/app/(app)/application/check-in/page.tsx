import CheckInSearch from '@/components/check-in-search'
import { getAllActiveAttendances } from '@/actions/check-in-actions'
import AttendanceCard from '@/components/attendance-card'
import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { checkIfAdmin } from '@/lib/server-utils'

export default async function Page() {
  await checkIfAdmin()

  const { data: attendances } = await getAllActiveAttendances()
  const activeMember = await auth.api.getActiveMember({
    headers: await headers(),
  })

  if (!activeMember) {
    redirect('/application/start')
  }

  if (activeMember.role !== 'owner' && activeMember.role !== 'admin') {
    redirect('/application')
  }

  return (
    <main
      className="w-full 2xl:w-[75%] xl:m-auto h-full p-4 space-y-5 overflow-y-auto scrollbar-clean
     "
    >
      <CheckInSearch />
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
        {attendances ? (
          attendances.map((attendance) => (
            <AttendanceCard key={attendance.id} attendance={attendance} />
          ))
        ) : (
          <p>Could not load attendances</p>
        )}
      </div>
    </main>
  )
}
