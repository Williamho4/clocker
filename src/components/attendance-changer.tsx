"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dispatch, SetStateAction, useState } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export default function AttendanceChanger() {
  const [date, setDate] = useState<Date | undefined>();

  return (
    <Card className="w-full h-full">
      <CardHeader>
        <CardTitle>
          <DatePicker date={date} setDate={setDate} />
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 overflow-y-auto scrollbar-clean">
        <AttendanceCard />
        <AttendanceCard />
        <AttendanceCard />
        <AttendanceCard />
      </CardContent>
    </Card>
  );
}

function AttendanceCard() {
  return (
    <Card>
      <CardContent className="space-y-3">
        <div>
          <p className="font-bold">William Ho</p>
          <div className="flex justify-between">
            <div className="flex items-center gap-1">
              <Clock size={20} />
              Check In: <span className="font-bold">10:50</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock size={20} />
              Check Out: <span className="font-bold">10:50</span>
            </div>
          </div>
        </div>

        <Button className="w-full">Edit</Button>
      </CardContent>
    </Card>
  );
}

type DatePickerProps = {
  date: Date | undefined;
  setDate: Dispatch<SetStateAction<Date | undefined>>;
};

function DatePicker({ date, setDate }: DatePickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          data-empty={!date}
          className="data-[empty=true]:text-muted-foreground w-[280px] justify-start text-left font-normal"
        >
          <CalendarIcon />
          {date ? format(date, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar mode="single" selected={date} onSelect={setDate} />
      </PopoverContent>
    </Popover>
  );
}
