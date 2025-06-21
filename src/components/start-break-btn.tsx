'use client'

import { startBreak } from '@/actions/check-in-actions'
import { Button } from './ui/button'
import { toast } from 'sonner'

type StartBreakBtnProps = {
  attendanceId: string
}

export default function StartBreakBtn({ attendanceId }: StartBreakBtnProps) {
  async function handleStartBreak() {
    const error = await startBreak({ attendanceId })

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
