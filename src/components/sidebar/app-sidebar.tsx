'use client';

import {
	Bell, Bot,
	Frame,
	Home,
	type LucideIcon,
	Map as MapIcon,
	PieChart,
	Settings2, Users, FolderOpen,
	CheckSquare
} from 'lucide-react';
import type * as React from 'react';

import { NavMain, NavProjects, NavUser } from '@/components/sidebar/';
import { ThemeSwitcher } from '@/modules/landing/components';
import { WorkspaceSwitcher } from '@/modules/workspaces/ui/workspace-switcher';
import { Separator } from '@/shared/components/ui/separator';
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarRail,
} from '@/shared/components/ui/sidebar';

type NavItem = {
	title: string;
	url: string;
	icon?: LucideIcon;
	isActive?: boolean;
	items?: {
		title: string;
		url: string;
	}[];
};

type Project = {
	name: string;
	url: string;
	icon: LucideIcon;
};

const data = {
	currentWorkspace: {
		id: '1',
		name: 'Personal Workspace',
	},
	workspaces: [
		{
			id: '1',
			name: 'Personal Workspace',
			role: 'owner',
		},
		{
			id: '2',
			name: 'Team Workspace',
			role: 'member',
		},
		{
			id: '3',
			name: 'Client Project',
			role: 'admin',
		},
	],
	navMain: [
		{
			title: 'Dashboard',
			url: '/dashboard',
			icon: Home,
			isActive: true,
		},
		{
			title: 'Notifications',
			url: '/dashboard/notifications',
			icon: Bell,
		},
		{
			title: 'Projects',
			url: '/dashboard/projects',
			icon: FolderOpen,
		},
		{
			title: 'Tasks',
			url: '/dashboard/tasks',
			icon: CheckSquare,
		},
		{
			title: 'Members',
			url: '/dashboard/members',
			icon: Users,
		},
		{
			title: 'Analytics',
			url: '/dashboard/analytics',
			icon: Bot,
		},
		{
			title: 'Settings',
			url: '/dashboard/settings',
			icon: Settings2,
			items: [
				{
					title: 'Profile',
					url: '/dashboard/profile',
				},
				{
					title: 'Workspace',
					url: '/dashboard/settings',
				},
			],
		},
	] as NavItem[],
	projects: [
		{
			name: 'Design Engineering',
			url: '#',
			icon: Frame,
		},
		{
			name: 'Sales & Marketing',
			url: '#',
			icon: PieChart,
		},
		{
			name: 'Travel',
			url: '#',
			icon: MapIcon,
		},
	] as Project[],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	return (
		<Sidebar collapsible="icon" {...props}>
			<SidebarHeader>
				<WorkspaceSwitcher />
			</SidebarHeader>
			<SidebarContent>
				<NavMain items={data.navMain} />
				<NavProjects projects={data.projects} />
			</SidebarContent>
			<SidebarFooter>
				<div className="flex flex-col gap-2">
					<div className="px-2">
						<ThemeSwitcher />
					</div>
					<Separator className="my-1" />
					<NavUser />
				</div>
			</SidebarFooter>
			<SidebarRail />
		</Sidebar>
	);
}
