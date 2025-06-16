'use client'

import { checkOutEmployee } from '@/actions/check-in-actions'
import { Button } from './ui/button'
import { toast } from 'sonner'

type CheckOutBtnProps = {
  attendanceId: string
  orgId: string
}

export default function CheckOutBtn({ attendanceId, orgId }: CheckOutBtnProps) {
  const handleCheckout = async () => {
    const error = await checkOutEmployee(attendanceId, orgId)

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
