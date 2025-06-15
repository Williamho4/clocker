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
import { ActiveOrganization, Session } from '@/lib/auth-types'
import { toast } from 'sonner'

type ShiftFormProps = {
  selectedDay: Date
  setIsFormOpen: Dispatch<SetStateAction<boolean>>
  activeOrganization: ActiveOrganization
  session: Session | null
  setReRender: Dispatch<SetStateAction<boolean>>
}

export default function ShiftForm({
  selectedDay,
  setIsFormOpen,
  activeOrganization,
  setReRender,
}: ShiftFormProps) {
  if (!activeOrganization) {
    redirect('/')
  }

  const handleFormSubmit = async (formData: FormData) => {
    const startTime = formData.get('startTime') as string
    const endTime = formData.get('endTime') as string
    const employeeId = formData.get('employee') as string

    const formattedStartTime = combineDateAndTime(selectedDay, startTime)
    const formattedEndTime = combineDateAndTime(selectedDay, endTime)

    const error = await createShift(
      formattedStartTime,
      formattedEndTime,
      employeeId,
      activeOrganization?.id
    )

    if (error) {
      toast.error('Could not create shift')
      return
    }

    toast.success('Shift Created')
    setIsFormOpen(false)
    setReRender((prev) => !prev)
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
            {activeOrganization.members.map((member) => (
              <SelectItem key={member.id} value={member.userId}>
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
