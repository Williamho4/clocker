'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Label } from './ui/label'
import { Input } from './ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select'
import { Button } from './ui/button'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { authClient } from '@/lib/auth-client'
import { checkIfUserExists } from '@/actions/actions'
import { useState } from 'react'

const inviteMemberSchema = z.object({
  email: z.string().email(),
  role: z.enum(['admin', 'member']),
})

export default function InviteMemberDialog() {
  const [open, setOpen] = useState(false)
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<z.infer<typeof inviteMemberSchema>>({
    resolver: zodResolver(inviteMemberSchema),
  })

  const alreadyMember = async (email: string) => {
    const { data } = await authClient.organization.getFullOrganization()

    if (!data?.members) {
      return
    }

    const exists = data.members.some((member) => member.user.email === email)

    if (exists) {
      return true
    }
  }

  const handleInvite = async (data: z.infer<typeof inviteMemberSchema>) => {
    const validatedData = inviteMemberSchema.safeParse(data)

    if (!validatedData.success) {
      toast.error('Could not invite member')
      return
    }

    const UserExist = await checkIfUserExists(validatedData.data.email)

    if (!UserExist) {
      toast.error('Could not invite member')
      return
    }

    const isAlreadyMember = await alreadyMember(validatedData.data.email)

    if (isAlreadyMember) {
      toast.error('Already a member')
      return
    }

    await authClient.organization.inviteMember({
      ...validatedData.data,
    })

    setOpen(false)
    toast.success('Member Invited')
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <Button>Invite member</Button>
      </DialogTrigger>
      <DialogContent className="w-100">
        <DialogHeader>
          <DialogTitle>Invite Member</DialogTitle>
          <DialogDescription>
            Invite a member to your organization
          </DialogDescription>
          <form onSubmit={handleSubmit(handleInvite)}>
            <div className="mt-1 mb-5 space-y-3">
              <Label htmlFor="email">Email</Label>
              <Input id="email" {...register('email', { required: true })} />
              {errors.email && (
                <p className="text-red-600">{errors.email.message}</p>
              )}
            </div>
            <Controller
              control={control}
              name="role"
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <div className="mt-1 mb-2 space-y-3">
                    <Label htmlFor="role">Role</Label>
                    <SelectTrigger id="role" className="w-full">
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                  </div>
                  <SelectContent>
                    <SelectItem value="member">Member</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.role && (
              <p className="text-red-600">{errors.role.message}</p>
            )}
            <Button className="mt-4">Send Invite</Button>
          </form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}
