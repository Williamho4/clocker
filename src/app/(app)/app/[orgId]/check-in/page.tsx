import CheckInSearch from '@/components/check-in-search'
import { getAllActiveAttendances } from '@/actions/check-in-actions'
import AttendanceCard from '@/components/attendance-card'

type PageProps = {
  params: Promise<{ orgId: string }>
}

export default async function Page({ params }: PageProps) {
  const { orgId } = await params
  const attendances = await getAllActiveAttendances(orgId)

  return (
    <main
      className="w-full 2xl:w-[75%] xl:m-auto h-full p-4 space-y-5
     "
    >
      <CheckInSearch orgId={orgId} />
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
        {attendances.map((attendance) => (
          <AttendanceCard
            key={attendance.id}
            attendance={attendance}
            orgId={orgId}
          />
        ))}
      </div>
    </main>
  )
}
