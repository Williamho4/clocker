import { Button } from '@/components/ui/button'

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import CheckInSearch from '@/components/check-in-search'
import { getAllActiveShifts } from '@/actions/check-in-actions'
import { Shift, User } from '@prisma/client'
import { format } from 'date-fns'
import CheckOutBtn from '@/components/check-out-btn'

type PageProps = {
  params: {
    orgId: string
  }
}

export default async function Page({ params }: PageProps) {
  const { orgId } = await params
  const activeShifts = await getAllActiveShifts(orgId)

  console.log(activeShifts)

  return (
    <main
      className="w-full 2xl:w-[75%] xl:m-auto h-full bg-slate-300 p-4 space-y-5
     "
    >
      <CheckInSearch />
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
        {activeShifts.map((shift) => (
          <CheckInCard key={shift.id} shift={shift} orgId={orgId} />
        ))}
      </div>
    </main>
  )
}

type ShiftWithUser = Shift & {
  user: User
}

type CheckInCardProps = {
  shift: ShiftWithUser
  orgId: string
}

function CheckInCard({ shift, orgId }: CheckInCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{shift.user.name}</CardTitle>
        <CardDescription>
          {format(shift.startTime, 'HH:mm')} - 20:00
        </CardDescription>
        <CardAction>
          <Badge variant="default" className="bg-green-100 text-green-800">
            Active
          </Badge>
        </CardAction>
      </CardHeader>
      <CardContent className="flex justify-between w-[60%] sm:w-[50%] md:w-[60%]">
        <div>
          <p>Check-In Time</p>
          <p className="font-bold">08:00</p>
        </div>
        <div>
          <p>Hours Worked</p>
          <p className="font-bold">6h 30m</p>
        </div>
      </CardContent>
      <CardFooter className="w-full flex justify-between">
        <Button className="w-[48%]">Go On Break</Button>
        <CheckOutBtn shiftId={shift.id} orgId={orgId} />
      </CardFooter>
    </Card>
  )
}
