import { Plus } from 'lucide-react'
import ShiftForm from './shift-form'
import { Button } from './ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog'
import { Dispatch, SetStateAction, useState } from 'react'
import { ActiveOrganization, Session } from '@/lib/auth-types'

type AddShiftBtnProps = {
  selectedDay: Date
  activeOrganization: ActiveOrganization | null
  session: Session | null
  setReRender: Dispatch<SetStateAction<boolean>>
}

export default function AddShiftBtn({
  selectedDay,
  activeOrganization,
  session,
  setReRender,
}: AddShiftBtnProps) {
  const [isFormOpen, setIsFormOpen] = useState(false)

  return (
    <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
      <DialogTrigger asChild>
        <Button className="cursor-pointer">
          <Plus />
          Add Shift
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add new shift</DialogTitle>
          <DialogDescription className="mb-5">
            Schedule a shift for an employee. All fields are required.
          </DialogDescription>
          <ShiftForm
            setReRender={setReRender}
            activeOrganization={activeOrganization}
            session={session}
            selectedDay={selectedDay}
            setIsFormOpen={setIsFormOpen}
          />
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}
