import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select'
import UserImage from './user-image'
import { createShiftChangeRequest } from '@/actions/user-actions'
import { Shift } from '@prisma/client'
import { toast } from 'sonner'
import { MemberWithUser } from '@/lib/prisma/member/select'
import { Button } from './ui/button'
import { Dispatch, SetStateAction } from 'react'

type RequestShiftChangeFormProps = {
  selectedShift: Shift
  colleagues: MemberWithUser[]
  setOpen: Dispatch<SetStateAction<boolean>>
}

export default function RequestShiftChangeForm({
  selectedShift,
  colleagues,
  setOpen,
}: RequestShiftChangeFormProps) {
  const handleSubmit = async (formData: FormData) => {
    const colleagueId = formData.get('colleague') as string

    const error = await createShiftChangeRequest({
      colleagueId,
      shiftId: selectedShift.id,
    })

    if (error) {
      toast.error(error.message)

      return
    }

    setOpen(false)
    toast.success('Request Sent')
  }

  return (
    <form action={handleSubmit}>
      <Select name="colleague">
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Colleagues" />
        </SelectTrigger>
        <SelectContent>
          {colleagues.map((colleague) => (
            <SelectItem
              key={colleague.id}
              value={colleague.id}
              className="capitalize "
            >
              <UserImage
                className="h-6 w-6 m-auto"
                firstName={colleague.user.firstName}
                lastName={colleague.user.lastName}
              />
              {colleague.user.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Button className="mt-5" type="submit">
        Send
      </Button>
    </form>
  )
}
