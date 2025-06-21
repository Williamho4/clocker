'use client'

import { Trash2 } from 'lucide-react'
import { Button } from './ui/button'
import { deleteShift } from '@/actions/schedule-actions'
import { toast } from 'sonner'
import { ScheduleWithShifts } from '@/lib/prisma/schedule/select'

type RemoveShiftBtnProps = {
  shiftData: ScheduleWithShifts['shifts'][number]
}

export default function RemoveShiftBtn({ shiftData }: RemoveShiftBtnProps) {
  const handleDeleteShift = async () => {
    const error = await deleteShift({ shiftId: shiftData.id })

    if (error) {
      return toast(error.message)
    }

    toast.success(`${shiftData.member.user.firstName}'s Shift deleted`)
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      className="opacity-0 group-hover:opacity-100 absolute right-2  cursor-pointer"
      onClick={handleDeleteShift}
    >
      <Trash2 className="h-3 w-3" />
    </Button>
  )
}
