import { completedShifts } from '@/lib/prisma/shifts/select'
import { Card, CardContent } from './ui/card'
import { formatToTimeZoneAndFormat } from '@/lib/utils'
import { Clock } from 'lucide-react'
import { useState } from 'react'
import Datetime from 'react-datetime'

type AttendanceInfo = {
  shift: completedShifts
}

export default function AttendanceEditCard({ shift }: AttendanceInfo) {
  const { member, checkOutTime } = shift
  const [checkInTime, setCheckInTime] = useState(shift.checkInTime)

  return (
    <Card>
      <CardContent className="space-y-3">
        <div>
          <p className="font-bold capitalize">
            {member.user.firstName} {member.user.lastName}
          </p>
          <div
            className="flex justify-between 
            mt-2
            lg:flex-col lg:space-y-2 
          xl:space-y-0 
          xl:flex-row"
          >
            <div className="flex items-center gap-1">
              <Clock size={20} />
              <Datetime
                value={checkInTime ? checkInTime : undefined}
                onChange={setCheckInTime}
              />
            </div>
            <div className="flex items-center gap-1">
              <Clock size={20} />
              Check Out:{' '}
              <span className="font-bold">
                {checkOutTime
                  ? formatToTimeZoneAndFormat(checkOutTime, 'PP HH:mm')
                  : 'Not checked out'}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
