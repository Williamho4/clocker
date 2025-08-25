'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { format } from 'date-fns'
import { Calendar as CalendarIcon, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { redirect } from 'next/navigation'
import { completedShifts } from '@/lib/prisma/shifts/select'
import AttendanceEditCard from './attendance-edit-card'

type AttendanceChangerProps = {
  date: Date | undefined
  shifts: completedShifts[]
}

export default function AttendanceChanger({
  date,
  shifts,
}: AttendanceChangerProps) {
  console.log(shifts)

  return (
    <Card className="w-full h-full">
      <CardHeader>
        <CardTitle>
          <DatePicker date={date} />
        </CardTitle>
      </CardHeader>
      <CardContent className="grid lg:grid-cols-2 gap-4 overflow-y-auto scrollbar-clean">
        {shifts.length > 0 ? (
          shifts.map((shift) => (
            <AttendanceEditCard key={shift.id} shift={shift} />
          ))
        ) : (
          <p>No Shifts Recorded</p>
        )}
      </CardContent>
    </Card>
  )
}

type DatePickerProps = {
  date: Date | undefined
}

function DatePicker({ date }: DatePickerProps) {
  function changeDate(newDate: Date) {
    redirect(`/application/admin?date=${format(newDate, 'yyyy-MM-dd')}`)
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          data-empty={!date}
          className="data-[empty=true]:text-muted-foreground w-[280px] justify-start text-left font-normal"
        >
          <CalendarIcon />
          {date ? format(date, 'PPP') : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={(selected) => {
            if (selected) changeDate(selected)
          }}
        />
      </PopoverContent>
    </Popover>
  )
}
