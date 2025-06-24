import AttendanceChanger from "@/components/attendance-changer";
import { checkIfAdmin } from "@/lib/server-utils";

export default async function Page() {
  await checkIfAdmin();

  return (
    <main
      className="w-full 2xl:w-[75%] xl:m-auto h-full p-4 space-y-5 overflow-y-auto scrollbar-clean
     "
    >
      <section className="w-full h-full">
        <AttendanceChanger />
      </section>
    </main>
  );
}
