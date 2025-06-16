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
import { Attendance, Break, Member, Shift, User } from '@prisma/client'
import { differenceInMinutes, format } from 'date-fns'
import CheckOutBtn from '@/components/check-out-btn'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { getAllActiveAttendances } from '@/actions/check-in-actions'
import GoOnBreakBtn from '@/components/start-break-btn'
import StartBreakBtn from '@/components/start-break-btn'
import StopBreakBtn from '@/components/stop-break-button'

type PageProps = {
  params: {
    orgId: string
  }
}

export default async function Page({ params }: PageProps) {
  const { orgId } = await params
  const attendances = await getAllActiveAttendances(orgId)

  return (
    <main
      className="w-full 2xl:w-[75%] xl:m-auto h-full bg-slate-300 p-4 space-y-5
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

type MemberAndUser = Member & {
  user: User
}

type AttendanceWithMemberAndUser = Attendance & {
  member: MemberAndUser
  breaks: Break[]
}

type CheckInCardProps = {
  attendance: AttendanceWithMemberAndUser
  orgId: string
}

function AttendanceCard({ attendance, orgId }: CheckInCardProps) {
  const { user } = attendance.member

  const totalMinutes = differenceInMinutes(new Date(), attendance.checkInTime!)

  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60

  return (
    <Card>
      <CardHeader>
        <div className="flex gap-3 items-center">
          <Avatar className="h-8 w-8 rounded-lg">
            <AvatarImage
              src={`https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}&background=random&rounded=true&font-size=0.33`}
            />
            <AvatarFallback className="rounded-lg">CN</AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <CardTitle>{user.name}</CardTitle>
            {/* {attendance.startTime && endTime && (
              <CardDescription>
                {format(startTime, 'HH:mm')} - {format(endTime, 'HH:mm')}
              </CardDescription>
            )} */}
          </div>
        </div>
        <CardAction>
          {attendance.breaks.length === 0 ? (
            <Badge variant="default" className="bg-green-100 text-green-800">
              Active
            </Badge>
          ) : (
            <Badge
              variant="secondary"
              className="bg-yellow-100 text-yellow-800"
            >
              On Break
            </Badge>
          )}
        </CardAction>
      </CardHeader>
      <CardContent className="flex justify-between w-[60%] sm:w-[50%] md:w-[60%]">
        <div>
          <p>Check-In Time</p>
          <p className="font-bold">
            {format(attendance.checkInTime!, 'HH:mm')}
          </p>
        </div>
        <div>
          <p>Time Worked</p>
          <p className="font-bold">{`${hours}h ${minutes}m`}</p>
        </div>
      </CardContent>
      <CardFooter className="w-full flex justify-between">
        {attendance.breaks.length === 0 ? (
          <StartBreakBtn
            attendanceId={attendance.id}
            orgId={attendance.organizationId}
          />
        ) : (
          <StopBreakBtn
            breakId={attendance.breaks[0].id}
            orgId={attendance.organizationId}
          />
        )}
        <CheckOutBtn attendanceId={attendance.id} orgId={orgId} />
      </CardFooter>
    </Card>
  )
}
