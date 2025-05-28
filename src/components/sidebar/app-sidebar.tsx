"use client"

import {
  CheckSquare,
  FolderOpen,
  Home,
  Settings,
  Users
} from "lucide-react"
import * as React from "react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/shared/components/ui/sidebar"

import { TWorkspaceWithOwner } from "@/modules/workspaces/types"
import { NavMain } from "./nav-main"
import { NavProjects } from "./nav-projects"
import { NavUser } from "./nav-user"
import { TeamSwitcher } from "./team-switcher"

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  workspaces: TWorkspaceWithOwner[]
  user: {
    name: string
    email: string
    avatar: string | null
  }
  projects?: Array<{
    name: string
    url: string
    icon: React.ComponentType<{ className?: string }>
  }>
}

// Navigation data
const getNavMain = () => [
  {
    title: "Overview",
    url: "/dashboard",
    icon: Home,
    isActive: true,
  },
  {
    title: "Projects",
    url: "/dashboard/projects",
    icon: FolderOpen,
  },
  {
    title: "Tasks",
    url: "/dashboard/tasks",
    icon: CheckSquare,
  },
  {
    title: "Members",
    url: "/dashboard/members",
    icon: Users,
  },
  {
    title: "Invite",
    url: "/dashboard/invite",
    icon: Users,
  },
  {
    title: "Settings",
    url: "/dashboard/settings",
    icon: Settings,
  },
]

export function AppSidebar({ workspaces, user, projects, ...props }: AppSidebarProps) {
  const navMain = getNavMain()

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher workspaces={workspaces} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain} />
        {projects && <NavProjects projects={projects} />}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
