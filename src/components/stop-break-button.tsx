'use client'

import { stopBreak } from '@/actions/check-in-actions'
import { Button } from './ui/button'
import { toast } from 'sonner'

type StartBreakBtnProps = {
  breakId: string
}

export default function StopBreakBtn({ breakId }: StartBreakBtnProps) {
  async function handleStopBreak() {
    const error = await stopBreak({ breakId })

    if (error) {
      toast.error(error.message)
      return
    }

    toast.success('Break stopped')
  }

  return (
    <Button onClick={handleStopBreak} className="w-[48%]">
      Stop Break
    </Button>
  )
}
