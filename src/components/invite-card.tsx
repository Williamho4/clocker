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
import { Invitation } from '@prisma/client'
import { authClient } from '@/lib/auth-client'

type InvitaionWithOrgName = Invitation & {
  organization: {
    name: string
  }
}

type InvitationCardProps = {
  invitation: InvitaionWithOrgName
}

export default function InviteCard({ invitation }: InvitationCardProps) {
  const handleAcceptInvite = async () => {
    await authClient.organization.acceptInvitation({
      invitationId: invitation.id,
    })
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
