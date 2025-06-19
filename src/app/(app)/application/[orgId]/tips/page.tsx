import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import UserImage from "@/components/user-image";
import { Calculator, Clock, DollarSign, User } from "lucide-react";

export default function Page() {
  return (
    <main
      className="w-full m-auto h-full p-4 overflow-y-auto scrollbar-clean
     "
    >
      <section className="w-full md:w-[70%] m-auto">
        <TipsHeader />
        <TipsInput />
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="text-xl">
              Employee Hours & Tips Distribution
            </CardTitle>
            <CardDescription>
              Tips are distributed proportionally based on hours worked
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <EmployeeTipCard />
            <EmployeeTipCard />
            <EmployeeTipCard />
            <EmployeeTipCard />
            <EmployeeTipCard />
            <EmployeeTipCard />
            <EmployeeTipCard />

            <div className="mt-6 p-4 bg-muted rounded-lg">
              <div className="flex justify-between items-center">
                <span className="font-medium">Total Distributed:</span>
                <span className="text-lg font-bold">$ 200</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}

function TipsHeader() {
  return (
    <section className="w-full grid md:grid-cols-3 gap-3 m-auto">
      <Card className="h-25 flex justify-center">
        <CardContent className="flex items-center gap-4">
          <User size={30} color="blue" />
          <div>
            <p className="text-gray-500">Total Employees</p>
            <p className="text-2xl font-bold">5</p>
          </div>
        </CardContent>
      </Card>
      <Card className="h-25 flex justify-center">
        <CardContent className="flex items-center gap-4">
          <Clock size={30} color="green" />
          <div>
            <p className="text-gray-500">Total Hours</p>
            <p className="text-2xl font-bold">34.0</p>
          </div>
        </CardContent>
      </Card>
      <Card className="h-25 flex justify-center">
        <CardContent className="flex items-center gap-4">
          <DollarSign size={30} color="green" />
          <div>
            <p className="text-gray-500">Total</p>
            <p className="text-2xl font-bold">$200.00</p>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}

function TipsInput() {
  return (
    <Card className="mt-8">
      <CardHeader className="text-2xl  items-center">
        <div className="flex items-center gap-2">
          <Calculator />
          <p className="font-bold">Enter total tips</p>
        </div>
        <CardDescription>
          Enter the total amount of tips to be distributed among employees
        </CardDescription>

        <CardContent className="px-0 space-y-2 mt-8">
          <Label htmlFor="tips">Total tips ammount</Label>
          <div className="grid grid-cols-[6fr_2fr_1fr] w-full  gap-2">
            <Input className="4fr" id="tips" />
            <Button className="1fr  bg-green-700  hover:bg-green-800">
              Calulate
            </Button>
            <Button className="1fr bg-white text-black border hover:bg-gray-300">
              Reset
            </Button>
          </div>
        </CardContent>
      </CardHeader>
    </Card>
  );
}

function EmployeeTipCard() {
  return (
    <div className="flex items-center gap-3 border-b pb-3 text-lg">
      <UserImage firstName="Alice" lastName="Johnson" />
      <div>
        <p>Alice Johnson</p>
        <div className="flex items-center gap-2">
          <div className="flex gap-2 ">
            <Clock />
            8.5 Hours
          </div>
          <Badge variant="secondary" className="bg-gray-200 text-gray-900">
            11.8%
          </Badge>
        </div>
      </div>
      <div className="ml-auto">
        <p className="text-lg font-bold text-green-600">$20</p>

        <p className="text-xs text-muted-foreground">$2/hour</p>
      </div>
    </div>
  );
}
