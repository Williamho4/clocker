import { getCompletedShifts } from '@/actions/admin-actions'
import AttendanceChanger from '@/components/attendance-changer'
import { checkIfAdmin } from '@/lib/server-utils'
import { format } from 'date-fns'
import { redirect } from 'next/navigation'

type PageProps = {
  searchParams: Promise<{ date: number }>
}

export default async function Page({ searchParams }: PageProps) {
  await checkIfAdmin()

  let { date } = await searchParams

  if (!date) {
    const now = new Date()
    redirect(`/application/admin?date=${format(now, 'yyyy-MM-dd')}`)
  }

  const convertedDate = new Date(date)

  const { data: shifts } = await getCompletedShifts({ date: convertedDate })

  return (
    <main
      className="w-full 2xl:w-[75%] xl:m-auto h-full p-4 space-y-5 overflow-y-auto scrollbar-clean
     "
    >
      <section className="w-full h-full">
        {shifts ? (
          <AttendanceChanger date={convertedDate} shifts={shifts} />
        ) : (
          <p>Could not load shifts</p>
        )}
      </section>
    </main>
  )
}
