import { getAllUsersOrganizations } from '@/actions/user-actions'
import CreateOrgForm from '@/components/create-org-form'
import OrgCard from '@/components/org-card'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

export default async function Page() {
  const organizations = await getAllUsersOrganizations()
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    redirect('/auth/sign-in')
  }

  return (
    <main className="w-full 2xl:w-[90%] xl:mx-auto h-full p-4 overflow-y-auto scrollbar-clean flex pt-10">
      <section className="md:w-[80%] m-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-2">
            Welcome <span className="capitalize">{session.user.name}</span>
          </h1>
          <p className="text-muted-foreground text-lg">
            Choose an organization to continue
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          {!organizations || organizations.length <= 0 ? (
            <CreateOrgForm />
          ) : (
            organizations.map((org) => <OrgCard key={org.id} org={org} />)
          )}
        </div>
      </section>
    </main>
  )
}
