'use client'

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Search, UserPlus } from 'lucide-react'
import { Label } from './ui/label'
import { Input } from './ui/input'
import { useEffect, useState } from 'react'
import { useDebounce } from 'use-debounce'
import { searchOrgMember } from '@/actions/check-in-actions'
import UserImage from './user-image'
import CheckInBtn from './check-in-btn'
import { MemberWithUser } from '@/lib/prisma/member/select'

type CheckInSearchProps = {
  orgId: string
}

export default function CheckInSearch({ orgId }: CheckInSearchProps) {
  const [query, setQuery] = useState('')
  const [employees, setEmployees] = useState<MemberWithUser[] | []>([])
  const [searchValue] = useDebounce(query, 400)
  const [selectedEmployee, setSelectedEmployee] =
    useState<MemberWithUser | null>(null)

  const resetSearch = () => {
    setQuery('')
    setEmployees([])
    setSelectedEmployee(null)
  }

  useEffect(() => {
    async function getEmployees() {
      const employees = await searchOrgMember(orgId, searchValue)
      setEmployees(employees)
    }

    if (searchValue.trim() !== '') {
      getEmployees()
    } else {
      setEmployees([])
    }
  }, [searchValue, orgId])

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
          <Input
            id="employee"
            className="pl-10"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        {employees.length > 0 && (
          <div className="max-h-48 overflow-y-auto border rounded-md">
            {employees.map((employee) => (
              <div
                key={employee.id}
                onClick={() => setSelectedEmployee(employee)}
                className={`p-3 cursor-pointer hover:bg-gray-50 border-b last:border-b-0 flex items-center gap-3`}
              >
                <UserImage
                  firstName={employee.user.firstName}
                  lastName={employee.user.lastName}
                />
                {employee.user.name}
              </div>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex w-full justify-between">
        {selectedEmployee && (
          <>
            <div
              className={`w-[49%] h-12 px-2 flex items-center gap-3 bg-blue-200 border-blue-400 border rounded-md truncate `}
            >
              <UserImage
                firstName={selectedEmployee.user.firstName}
                lastName={selectedEmployee.user.lastName}
              />
              {selectedEmployee.user.name}
            </div>
            <CheckInBtn
              resetSearch={resetSearch}
              orgId={orgId}
              memberId={selectedEmployee.id}
            />
          </>
        )}
      </CardFooter>
    </Card>
  )
}
