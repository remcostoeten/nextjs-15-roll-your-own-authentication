// This file defines the dashboard navigation structure.
// It fetches the current user and dynamically adds an "Admin" menu if the user has the 'admin' role.

import { getCurrentUser } from '@/modules/authentication/utilities/auth'
import {
	BookOpen,
	Bot,
	Frame,
	Map,
	PieChart,
	Settings2,
	SquareTerminal,
	ShieldCheck,
} from 'lucide-react'

export async function getDashboardNavigation() {
	const user = await getCurrentUser()

	const navMain = [
		{
			title: 'UI Playground',
			url: '#',
			icon: SquareTerminal,
			iconColor:
				'text-emerald-500 group-data-[active=true]/menu-item:text-emerald-400',
			isActive: true,
			items: [
				{
					title: 'Checkbox',
					url: '/dashboard/playground/checkbox',
				},
				{
					title: 'Flexer',
					url: '/dashboard/playground/flexer',
				},
				{
					title: 'Headings',
					url: '/dashboard/playground/headings',
				},
				{
					title: 'ui/checkbox',
					url: '/dashboard/playground/ui/checkbox',
				},
			],
		},
		{
			title: 'Models',
			url: '#',
			icon: Bot,
			iconColor:
				'text-purple-500 group-data-[active=true]/menu-item:text-purple-400',
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
			iconColor:
				'text-amber-500 group-data-[active=true]/menu-item:text-amber-400',
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
			iconColor:
				'text-sky-500 group-data-[active=true]/menu-item:text-sky-400',
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
	]

	// Add admin menu if user is admin
	if (user?.role === 'admin') {
		navMain.push({
			title: 'Admin',
			url: '#',
			icon: ShieldCheck,
			iconColor:
				'text-red-500 group-data-[active=true]/menu-item:text-red-400',
			items: [
				{
					title: 'User Management',
					url: '/admin/users',
				},
				{
					title: 'Settings',
					url: '/admin/settings',
				},
			],
		})
	}

	return {
		navMain,
		projects,
	}
}

export const projects = [
	{
		name: 'Design Engineering',
		url: '#',
		icon: Frame,
		iconColor:
			'text-rose-500 group-data-[active=true]/menu-item:text-rose-400',
	},
	{
		name: 'Sales & Marketing',
		url: '#',
		icon: PieChart,
		iconColor:
			'text-green-500 group-data-[active=true]/menu-item:text-green-400',
	},
	{
		name: 'Travel',
		url: '#',
		icon: Map,
		iconColor:
			'text-cyan-500 group-data-[active=true]/menu-item:text-cyan-400',
	},
]
