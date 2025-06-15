import { AppSidebar } from '@/components/app-sidebar'
import { SidebarProvider } from '@/components/ui/sidebar'
import Header from '@/components/header'

export default async function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <main className="flex max-w-screen w-screen h-screen ">
        <AppSidebar />
        <div className="flex flex-col w-full">
          <Header />
          <section className="flex-grow flex flex-col">{children}</section>
        </div>
      </main>
    </SidebarProvider>
  )
}
