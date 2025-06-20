'use client'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { MemberWithUser } from '@/lib/prisma/member/select'

import { Shift } from '@prisma/client'
import RequestShiftChangeForm from './request-shift-change-form'
import { useState } from 'react'

type RequestShiftChangeDialogProps = {
  selectedShift: Shift
  colleagues: MemberWithUser[]
}

export function RequestShiftChangeBtn({
  selectedShift,
  colleagues,
}: RequestShiftChangeDialogProps) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full">Request Change</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Request Shift Change</DialogTitle>
          <DialogDescription>
            Send a request to change shift with a colleague
          </DialogDescription>
        </DialogHeader>

        <RequestShiftChangeForm
          selectedShift={selectedShift}
          colleagues={colleagues}
          setOpen={setOpen}
        />
      </DialogContent>
    </Dialog>
  )
}
