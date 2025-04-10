import {
	BookOpen,
	Bot,
	CircleDashed,
	Frame,
	Home,
	Map,
	PieChart,
	Settings2,
	SquareTerminal,
	User,
} from 'lucide-react'

export const data = {
	navMain: [
		{
			title: 'Home',
			url: '/',
			icon: Home,
			iconColor: 'text-emerald-500',
		},
		{
			title: 'Dashboard',
			url: '/dashboard',
			icon: CircleDashed,
			iconColor: 'text-emerald-500',
		},
		{
			title: 'Playground',
			url: '/dashboard/playground',
			icon: SquareTerminal,
			iconColor: 'text-emerald-500',
			items: [
				{
					title: 'Checkbox',
					url: '/dashboard/playground/checkbox',
				},
				{
					title: 'Headings',
					url: '/dashboard/playground/headings',
				},
				{
					title: 'Loader',
					url: '/dashboard/playground/loader',
				},
			],
		},
		{
			title: 'Docs',
			url: '/docs',
			icon: Bot,
			iconColor: 'text-purple-500',
			items: [
				{
					title: 'Route Protection',
					url: '/docs/route-protection',
				},
				{
					title: 'API authentication',
					url: '/docs/api-authentication',
				},
				{
					title: 'User Data',
					url: '/docs/user-data',
				},
			],
		},
		{
			title: 'Workspaces',
			url: '/dashboard/workspaces',
			icon: BookOpen,
			iconColor: 'text-amber-500',
			items: [
				{
					title: 'Create',
					url: '/dashboard/workspaces/create',
				},
			],
		},
		{
			title: 'Snippets',
			url: '/dashboard/snippets',
			icon: BookOpen,
			iconColor: 'text-amber-500',
		},
		{
			title: 'Profile',
			url: '/dashboard/profile',
			icon: User,
			iconColor: 'text-amber-500',
			items: [
				{
					title: 'Settings',
					url: '/dashboard/profile/settings',
				},
				{
					title: 'Notifications',
					url: '/dashboard/notifications',
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
