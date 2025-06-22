import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getDateDiffrenceInHours } from "@/lib/utils";
import { Shift } from "@prisma/client";
import { format, isSameDay, startOfDay } from "date-fns";
import { Calendar, Clock, User } from "lucide-react";
import { Badge } from "./ui/badge";
import { RequestShiftChangeBtn } from "./request-shift-change-btn";
import { MemberWithUser } from "@/lib/prisma/member/select";

type ShiftCardProps = {
  shiftData: Shift;
  colleagues: MemberWithUser[];
};

export default function ShiftCard({ shiftData, colleagues }: ShiftCardProps) {
  const totalHours = getDateDiffrenceInHours(
    shiftData.startTime,
    shiftData.endTime
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Shift</CardTitle>

        <CardAction>
          {shiftData.startTime > startOfDay(new Date()) &&
            !isSameDay(shiftData.startTime, new Date()) && (
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                Upcoming
              </Badge>
            )}
          {shiftData.startTime < startOfDay(new Date()) &&
            !isSameDay(shiftData.startTime, new Date()) && (
              <Badge
                variant="secondary"
                className="bg-green-100 text-green-800"
              >
                Done
              </Badge>
            )}
          {isSameDay(shiftData.startTime, new Date()) && (
            <Badge variant="secondary" className="bg-red-100 text-red-800">
              Today
            </Badge>
          )}
        </CardAction>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex gap-2 items-center">
          <Calendar size={20} />
          <p>{format(shiftData.startTime, "PPPP")}</p>
        </div>
        <div className="flex gap-2 items-center">
          <Clock size={20} />
          <p>
            {`${format(shiftData.startTime, "HH:mm")} - ${format(
              shiftData.endTime,
              "HH:mm"
            )}
            `}
          </p>
        </div>
        <div className="flex gap-2 items-center">
          <User size={20} />
          <p>{totalHours} Hours</p>
        </div>
      </CardContent>
      <CardFooter className="w-full">
        <RequestShiftChangeBtn
          selectedShift={shiftData}
          colleagues={colleagues}
        />
      </CardFooter>
    </Card>
  );
}
