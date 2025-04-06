'use client'

import type * as React from 'react'
import {
	BookOpen,
	Bot,
	Frame,
	Map,
	PieChart,
	Settings2,
	SquareTerminal,
} from 'lucide-react'

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

// This is sample data.
const data = {
	navMain: [
		{
			title: 'Playground',
			url: '#',
			icon: SquareTerminal,
			iconColor: 'text-emerald-500',
			isActive: true,
			items: [
				{
					title: 'History',
					url: '#',
				},
				{
					title: 'Starred',
					url: '#',
				},
				{
					title: 'Settings',
					url: '#',
				},
			],
		},
		{
			title: 'Models',
			url: '#',
			icon: Bot,
			iconColor: 'text-purple-500',
			items: [
				{
					title: 'Genesis',
					url: '#',
				},
				{
					title: 'Explorer',
					url: '#',
				},
				{
					title: 'Quantum',
					url: '#',
				},
			],
		},
		{
			title: 'Documentation',
			url: '#',
			icon: BookOpen,
			iconColor: 'text-amber-500',
			items: [
				{
					title: 'Introduction',
					url: '#',
				},
				{
					title: 'Get Started',
					url: '#',
				},
				{
					title: 'Tutorials',
					url: '#',
				},
				{
					title: 'Changelog',
					url: '#',
				},
			],
		},
		{
			title: 'Settings',
			url: '#',
			icon: Settings2,
			iconColor: 'text-sky-500',
			items: [
				{
					title: 'General',
					url: '#',
				},
				{
					title: 'Team',
					url: '#',
				},
				{
					title: 'Billing',
					url: '#',
				},
				{
					title: 'Limits',
					url: '#',
				},
			],
		},
	],
	projects: [
		{
			name: 'Design Engineering',
			url: '#',
			icon: Frame,
			iconColor: 'text-rose-500',
		},
		{
			name: 'Sales & Marketing',
			url: '#',
			icon: PieChart,
			iconColor: 'text-green-500',
		},
		{
			name: 'Travel',
			url: '#',
			icon: Map,
			iconColor: 'text-cyan-500',
		},
	],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	return (
		<Sidebar
			collapsible="icon"
			{...props}
		>
			<SidebarHeader>
				<WorkspaceSwitcher />
			</SidebarHeader>
			<SidebarContent>
				<NavMain items={data.navMain} />
				<NavProjects projects={data.projects} />
			</SidebarContent>
			<SidebarFooter>
				<NavUser />
			</SidebarFooter>
			<SidebarRail />
		</Sidebar>
	)
}
