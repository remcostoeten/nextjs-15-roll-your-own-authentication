import type * as React from 'react'
import { NavMain } from './nav-main'
import { NavProjects } from './nav-projects'
import { NavUser } from './nav-user'
import { WorkspaceSwitcher } from './workspace-switcher'
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarRail,
} from '@/components/dashboard/sidebar/sidebar'
import { getDashboardNavigation } from '@/core/config/dashboard-navigation'

export async function AppSidebar({
	...props
}: React.ComponentProps<typeof Sidebar>) {
	const { navMain, projects } = await getDashboardNavigation()

	return (
		<ClientSidebar {...props}>
			<SidebarHeader>
				<WorkspaceSwitcher />
			</SidebarHeader>
			<SidebarContent>
				<NavMain items={navMain} />
				<NavProjects projects={projects} />
			</SidebarContent>
			<SidebarFooter>
				<NavUser />
			</SidebarFooter>
			<SidebarRail />
		</ClientSidebar>
	)
}

function ClientSidebar({
	children,
	...props
}: React.ComponentProps<typeof Sidebar>) {
	return (
		<Sidebar
			collapsible="icon"
			{...props}
		>
			{children}
		</Sidebar>
	)
}
