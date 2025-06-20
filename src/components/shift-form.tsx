import { Label } from './ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { combineDateAndTime } from '@/lib/utils'
import { createShift } from '@/actions/schedule-actions'
import { redirect } from 'next/navigation'
import { Dispatch, SetStateAction } from 'react'
import { toast } from 'sonner'
import { authClient } from '@/lib/auth-client'

type ShiftFormProps = {
  selectedDay: Date
  setIsFormOpen: Dispatch<SetStateAction<boolean>>
  orgId: string
}

export default function ShiftForm({
  selectedDay,
  setIsFormOpen,
  orgId,
}: ShiftFormProps) {
  const { data: organization } = authClient.useActiveOrganization()

  if (!organization) {
    redirect('/application/start')
  }

  const handleFormSubmit = async (formData: FormData) => {
    const startTime = formData.get('startTime') as string
    const endTime = formData.get('endTime') as string
    const memberId = formData.get('employee') as string

    const formattedStartTime = combineDateAndTime(selectedDay, startTime)
    const formattedEndTime = combineDateAndTime(selectedDay, endTime)

    const error = await createShift(
      formattedStartTime,
      formattedEndTime,
      memberId,
      orgId
    )

    if (error) {
      toast.error(error.message)
      return
    }

    toast.success('Shift Created')
    setIsFormOpen(false)
  }

  return (
    <form action={handleFormSubmit}>
      <div className="space-y-3">
        <Label>Choose Employee</Label>
        <Select required name="employee">
          <SelectTrigger className="w-full cursor-pointer">
            <SelectValue placeholder="Employee" />
          </SelectTrigger>
          <SelectContent>
            {organization.members.map((member) => (
              <SelectItem key={member.id} value={member.id}>
                <p className="capitalize">{member.user.name}</p>
              </SelectItem>
            ))}
          </SelectContent>
          <div className="flex gap-10 w-full">
            <div className="w-full">
              <label htmlFor="startTime">Start Time</label>
              <Input id="startTime" type="time" name="startTime" required />
            </div>
            <div className="w-full">
              <label htmlFor="startTime">End Time</label>
              <Input id="endTime" type="time" name="endTime" required />
            </div>
          </div>

          <Button className="w-full mt-10">Add shift</Button>
        </Select>
      </div>
    </form>
  )
}
