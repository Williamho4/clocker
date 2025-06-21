import { checkInEmployee } from '@/actions/check-in-actions'
import { Button } from './ui/button'
import { toast } from 'sonner'
import { format } from 'date-fns'

type CheckInBtnProps = {
  memberId: string
  resetSearch: () => void
}

export default function CheckInBtn({ memberId, resetSearch }: CheckInBtnProps) {
  const handleCheckIn = async ({}) => {
    const checkInTime = format(new Date(), 'HH:mm')
    const error = await checkInEmployee({ memberId })

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
