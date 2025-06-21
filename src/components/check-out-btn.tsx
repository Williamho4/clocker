'use client'

import { checkOutEmployee } from '@/actions/check-in-actions'
import { Button } from './ui/button'
import { toast } from 'sonner'

type CheckOutBtnProps = {
  attendanceId: string
}

export default function CheckOutBtn({ attendanceId }: CheckOutBtnProps) {
  const handleCheckout = async () => {
    const error = await checkOutEmployee({
      attendanceId,
    })

    if (error) {
      toast.error('Could not check out')
    }

    toast.success('Checked out')
  }

  return (
    <Button onClick={handleCheckout} className="w-[48%]">
      Checkout
    </Button>
  )
}
