import { checkInEmployee } from '@/actions/check-in-actions'
import { Button } from './ui/button'
import { toast } from 'sonner'
import { format } from 'date-fns'

type CheckInBtnProps = {
  orgId: string
  memberId: string
  resetSearch: () => void
}

export default function CheckInBtn({
  orgId,
  memberId,
  resetSearch,
}: CheckInBtnProps) {
  const handleCheckIn = async ({}) => {
    const checkInTime = format(new Date(), 'HH:mm')
    const error = await checkInEmployee(orgId, memberId)

    if (error) {
      toast.error(error.message)

      return
    }

    resetSearch()
    toast.success(`Checked In at ${checkInTime}`)
  }

  return (
    <Button
      onClick={handleCheckIn}
      className={`w-[49%] h-12 bg-green-700 hover:bg-green-900`}
    >
      Check In
    </Button>
  )
}
