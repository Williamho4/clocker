'use client'

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from './ui/button'
import { authClient } from '@/lib/auth-client'
import { InvitationWithOrg } from '@/lib/prisma/Invitation/select'

type InvitationCardProps = {
  invitation: InvitationWithOrg
}

export default function InviteCard({ invitation }: InvitationCardProps) {
  const handleAcceptInvite = async () => {
    await authClient.organization.acceptInvitation({
      invitationId: invitation.id,
    })

    window.location.reload()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="capitalize">
          {invitation.organization.name}
        </CardTitle>
        <CardDescription>
          {`${invitation.organization.name} has invited you to their organization`}
        </CardDescription>
        <CardAction>Invitation</CardAction>
      </CardHeader>
      <CardContent className="flex justify-between mt-[-10px]">
        <Button onClick={handleAcceptInvite} className="w-[49%]">
          Accept
        </Button>
        <Button variant="outline" className="w-[49%] bg-white">
          Decline
        </Button>
      </CardContent>
    </Card>
  )
}
