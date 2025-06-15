import { Trash2 } from 'lucide-react'
import { Button } from './ui/button'
import { deleteShift } from '@/actions/schedule-actions'
import { toast } from 'sonner'
import { ShiftAndNames } from '@/lib/types'
import { Dispatch, SetStateAction } from 'react'

type RemoveShiftBtnProps = {
  shiftData: ShiftAndNames
  setReRender: Dispatch<SetStateAction<boolean>>
}

export default function RemoveShiftBtn({
  shiftData,
  setReRender,
}: RemoveShiftBtnProps) {
  const handleDeleteShift = async () => {
    const error = await deleteShift(shiftData.id)

    if (error) {
      return toast('Could not delete shift, please try again')
    }

    toast.success(`${shiftData.user.firstName}'s Shift deleted`)
    setReRender((prev) => !prev)
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
