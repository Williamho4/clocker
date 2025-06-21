import InviteMemberDialog from "@/components/invite-member-dialog";
import { checkIfAdmin } from "@/lib/server-utils";

export default async function Page() {
  await checkIfAdmin();

  return (
    <main className="w-full 2xl:w-[90%] xl:m-auto h-full  p-4 ">
      <InviteMemberDialog />
    </main>
  );
}
