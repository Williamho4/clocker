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
import { Badge } from './ui/badge'
import UserImage from './user-image'

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
}

export default function AttendanceCard({ attendance }: CheckInCardProps) {
  const { user } = attendance.member

  const totalMinutes = differenceInMinutes(new Date(), attendance.checkInTime!)

  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60

  return (
    <Card>
      <CardHeader>
        <div className="flex gap-3 items-center min-h-[40px]">
          <UserImage firstName={user.firstName} lastName={user.lastName} />
          <div className="space-y-1">
            <CardTitle className="capitalize">{user.name}</CardTitle>
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
      <CardContent className="flex flex-col gap-2 justify-between w-[70%] sm:w-[50%] md:w-[60%]">
        <div className="flex gap-2">
          <p>Check-In Time</p>
          <p className="font-bold">
            {format(attendance.checkInTime!, 'HH:mm')}
          </p>
        </div>
        <div className="flex gap-2">
          <p>Time Worked</p>
          <p className="font-bold">{`${hours}h ${minutes}m`}</p>
        </div>
      </CardContent>
      <CardFooter className="w-full flex justify-between">
        {attendance.breaks.length === 0 ? (
          <StartBreakBtn attendanceId={attendance.id} />
        ) : (
          <StopBreakBtn breakId={attendance.breaks[0].id} />
        )}
        <CheckOutBtn attendanceId={attendance.id} />
      </CardFooter>
    </Card>
  )
}
