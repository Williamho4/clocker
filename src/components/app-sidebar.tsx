'use client'

import {
  Building2,
  Calendar,
  Home,
  User,
  Clock9,
  CalendarClock,
} from 'lucide-react'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import Link from 'next/link'
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
import { useRouter } from 'next/navigation'
import { NavUser } from './nav-user'
import { getISOWeek, getISOWeekYear } from 'date-fns'

export function AppSidebar() {
  const { data: activeOrganization } = authClient.useActiveOrganization()
  const currentDate = new Date()
  const weekNumber = getISOWeek(currentDate)
  const year = getISOWeekYear(currentDate)

  const items = [
    {
      title: 'Home',
      url: '/app',
      icon: Home,
    },
    {
      title: 'User',
      url: '/app/user',
      icon: User,
    },
  ]

  if (activeOrganization) {
    items.push(
      {
        title: 'Company',
        url: `/app/${activeOrganization?.id}/admin`,
        icon: Building2,
      },

      {
        title: 'Scheduler',
        url: `/app/${activeOrganization?.id}/scheduler?week=${weekNumber}&year=${year}`,
        icon: Calendar,
      },
      {
        title: 'Check-In',
        url: `/app/${activeOrganization?.id}/check-in`,
        icon: Clock9,
      },
      {
        title: 'Shifts',
        url: '/app/shifts',
        icon: CalendarClock,
      }
    )
  }

  return (
    <Sidebar variant="inset">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>
            <h1>Clocker</h1>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <OrganizationSelecter />
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  )
}

const OrganizationSelecter = () => {
  const router = useRouter()
  const [isSelectorOpen, setIsSelectorOpen] = useState(false)
  const { data: organizations } = authClient.useListOrganizations()

  return (
    <>
      {organizations && (
        <SidebarMenuItem className="space-y-3">
          <Label className="ml-1">Organzations</Label>
          <Select
            open={isSelectorOpen}
            onOpenChange={setIsSelectorOpen}
            onValueChange={async (organizationId) => {
              await authClient.organization.setActive({
                organizationId,
              })
              router.push(`/app/${organizationId}`)
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {organizations.map((org) => (
                <SelectItem className=" capitalize" key={org.id} value={org.id}>
                  {org.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </SidebarMenuItem>
      )}
    </>
  )
}
