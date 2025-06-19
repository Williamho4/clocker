import InviteList from '@/components/invite-list'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

export default async function Page() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) redirect('/auth/sign-in')

  return (
    <main className="w-full 2xl:w-[90%] xl:m-auto h-full p-4 ">
      <InviteList session={session} />
    </main>
  )
}
