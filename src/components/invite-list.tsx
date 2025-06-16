import { getAllUserInvites } from '@/actions/actions'
import { Session } from '@/lib/auth-types'
import InviteCard from './invite-card'
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

type InviteListProps = {
  session: Session
}

export default async function InviteList({ session }: InviteListProps) {
  const invitations = await getAllUserInvites(session.user.email)

  const filteredInvitations = invitations.filter(
    (invitation) => invitation.status === 'pending'
  )

  return (
    <section className="flex flex-col ">
      <div className="px-4 sm:px-0 ml-1 mb-6">
        <h2 className="text-lg font-medium text-gray-900">Your Invitations</h2>
        <p className="mt-1 text-sm text-gray-600">
          Review and respond to your pending invitations
        </p>
      </div>
      <div className="grid gap-6 sm:grid-cols-2  lg:grid-cols-3">
        {filteredInvitations.length > 0 ? (
          filteredInvitations.map((invitation) => (
            <InviteCard key={invitation.id} invitation={invitation} />
          ))
        ) : (
          <Card className="h-22">
            <CardHeader>
              <CardTitle className="capitalize">
                No pending invitations
              </CardTitle>
              <CardDescription>Invites will show up here</CardDescription>
            </CardHeader>
          </Card>
        )}
      </div>
    </section>
  )
}
