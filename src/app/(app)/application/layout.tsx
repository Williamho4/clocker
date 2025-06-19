import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import Header from "@/components/header";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <main className="flex max-w-screen w-screen h-screen bg-slate-200">
        <AppSidebar />
        <div className="flex flex-col w-full my-2 mr-2 ml-2 md:ml-0 rounded-xl bg-white shadow-md">
          <div>
            <Header />
          </div>
          {children}
        </div>
      </main>
    </SidebarProvider>
  );
}
