import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Search, UserPlus } from 'lucide-react'
import { Label } from './ui/label'
import { Input } from './ui/input'

export default function CheckInSearch() {
  return (
    <Card className="">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <UserPlus className="h-5 w-5" />
          Check In Employee
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <Label htmlFor="employee">Search</Label>
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input id="employee" className="pl-10" />
        </div>
      </CardContent>
    </Card>
  )
}
