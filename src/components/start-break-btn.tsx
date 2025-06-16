'use client'

import { startBreak } from '@/actions/check-in-actions'
import { Button } from './ui/button'
import { toast } from 'sonner'

type StartBreakBtnProps = {
  attendanceId: string
  orgId: string
}

export default function StartBreakBtn({
  attendanceId,
  orgId,
}: StartBreakBtnProps) {
  async function handleStartBreak() {
    const error = await startBreak(attendanceId, orgId)

    if (error) {
      toast.error(error.message)
      return
    }

    toast.success('Break started')
  }

  return (
    <Button onClick={handleStartBreak} className="w-[48%]">
      Go On Break
    </Button>
  )
}
