import CreateOrgForm from "@/components/create-org-form";
import SignOutBtn from "@/components/sign-out-btn";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function Page() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) redirect("/auth/sign-in");

  const { user } = session;

  return (
    <main>
      {user.role === "ADMIN" && <p>Admin</p>}
      Welcome
      <SignOutBtn />
      <CreateOrgForm />
    </main>
  );
}
