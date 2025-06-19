'use client'

import { Label } from './ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select'
import { useState } from 'react'
import { authClient } from '@/lib/auth-client'

export default function OrgSelector() {
  const [isSelectorOpen, setIsSelectorOpen] = useState(false)
  const { data: organizations } = authClient.useListOrganizations()
  const { data: activeOrg } = authClient.useActiveOrganization()

  return (
    <>
      {organizations && organizations.length > 0 && (
        <div className="flex w-60 space-x-3">
          <Label className="ml-1">Organzations</Label>
          <Select
            open={isSelectorOpen}
            onOpenChange={setIsSelectorOpen}
            onValueChange={async (organizationId) => {
              await authClient.organization.setActive({
                organizationId,
              })
              window.location.reload()
            }}
            value={activeOrg?.id}
          >
            <SelectTrigger className="w-full">
              <SelectValue className="capitalize font-bold" />
            </SelectTrigger>
            <SelectContent>
              {organizations.map((org) => (
                <SelectItem
                  className="capitalize font-bold"
                  key={org.id}
                  value={org.id}
                >
                  {org.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
    </>
  )
}
