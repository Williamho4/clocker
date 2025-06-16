import { Attendance, Break, Member, Shift, User } from '@prisma/client'
import { differenceInMinutes, format } from 'date-fns'
import CheckOutBtn from './check-out-btn'
import StartBreakBtn from './start-break-btn'
import StopBreakBtn from './stop-break-button'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
  CardContent,
  CardFooter,
} from './ui/card'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Badge } from './ui/badge'

type MemberAndUser = Member & {
  user: User
}

type AttendanceWithMemberAndUserAndShift = Attendance & {
  member: MemberAndUser
  breaks: Break[]
  shift: Shift | null
}

type CheckInCardProps = {
  attendance: AttendanceWithMemberAndUserAndShift
  orgId: string
}

export default function AttendanceCard({
  attendance,
  orgId,
}: CheckInCardProps) {
  const { user } = attendance.member

  const totalMinutes = differenceInMinutes(new Date(), attendance.checkInTime!)

  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60

  return (
    <Card>
      <CardHeader>
        <div className="flex gap-3 items-center min-h-[40px]">
          <Avatar className="h-8 w-8 rounded-lg">
            <AvatarImage
              src={`https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}&background=random&rounded=true&font-size=0.33`}
            />
            <AvatarFallback className="rounded-lg">CN</AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <CardTitle>{user.name}</CardTitle>
            {attendance.shift && (
              <CardDescription>
                {format(attendance.shift.startTime, 'HH:mm')} -{' '}
                {format(attendance.shift.endTime, 'HH:mm')}
              </CardDescription>
            )}
          </div>
        </div>
        <CardAction>
          {attendance.breaks.length === 0 ? (
            <Badge variant="default" className="bg-green-100 text-green-800">
              Active
            </Badge>
          ) : (
            <Badge variant="secondary" className="bg-red-100 text-red-800">
              On Break
            </Badge>
          )}
        </CardAction>
      </CardHeader>
      <CardContent className="flex justify-between w-[70%] sm:w-[50%] md:w-[60%]">
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
