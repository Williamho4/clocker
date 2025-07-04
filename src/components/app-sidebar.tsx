"use client";

import {
  Building2,
  Calendar,
  Home,
  User,
  Clock9,
  CalendarClock,
  DollarSign,
  ShieldUser,
} from "lucide-react";
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
} from "@/components/ui/sidebar";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { NavUser } from "./nav-user";
import { getISOWeek, getISOWeekYear } from "date-fns";

export function AppSidebar() {
  const activeMember = authClient.useActiveMember();
  const currentDate = new Date();
  const weekNumber = getISOWeek(currentDate);
  const year = getISOWeekYear(currentDate);

  const items = [
    {
      title: "Home",
      url: "/application",
      icon: Home,
    },
    {
      title: "Shifts",
      url: "/application/shifts",
      icon: CalendarClock,
    },
  ];

  const adminItems = [
    {
      title: "Company",
      url: `/application/company`,
      icon: Building2,
    },
    {
      title: "Admin",
      url: `/application/admin`,
      icon: ShieldUser,
    },
    {
      title: "Scheduler",
      url: `/application/scheduler?week=${weekNumber}&year=${year}`,
      icon: Calendar,
    },
    {
      title: "Check-In",
      url: `/application/check-in`,
      icon: Clock9,
    },
    {
      title: "Tips",
      url: `/application/tips`,
      icon: DollarSign,
    },
  ];

  return (
    <Sidebar variant="floating" collapsible="icon">
      <SidebarContent className="gap-0">
        <SidebarGroup>
          <SidebarMenuButton asChild>
            <Link href={"/application/user"}>
              <User />
              <span>User</span>
            </Link>
          </SidebarMenuButton>
        </SidebarGroup>
        {activeMember.data && (
          <SidebarGroup>
            <SidebarGroupLabel>Clocker</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
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
        )}
        {activeMember.data && activeMember.data?.role !== "member" && (
          <SidebarGroup>
            <SidebarGroupLabel>Admin</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {adminItems.map((item) => (
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
        )}
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
