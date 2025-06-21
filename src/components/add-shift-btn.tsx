'use client'

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
import { useState } from 'react'

type AddShiftBtnProps = {
  selectedDay: Date
}

export default function AddShiftBtn({ selectedDay }: AddShiftBtnProps) {
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
          <ShiftForm selectedDay={selectedDay} setIsFormOpen={setIsFormOpen} />
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}
