type NavItem = {
	label: string
	href: string
	dropdown?: { label: string; href: string }[]
	button?: boolean
	buttonStyle?: 'primary' | 'secondary'
	shortcut?: string
	shortcutLabel?: string
	indicatorStyle?: 'triangle'
	adminOnly?: boolean
}

export const publicNavItems: NavItem[] = [
	{
		label: 'Documentation',
		href: '#',
		dropdown: [
			{ label: 'Client example', href: '/guides/client' },
			{ label: 'Server example', href: '/guides/server' }
		]
	},
	{
		label: 'Changelog',
		href: '/changelog'
	},
	{
		label: 'Sign in',
		href: '/sign-in',
		button: true,
		buttonStyle: 'primary',
		shortcut: 'l',
		shortcutLabel: 'L'
	},
	{
		label: 'Sign up',
		href: '/sign-up',
		button: true,
		buttonStyle: 'primary'
	}
]

export const privateNavItems: NavItem[] = [
	{
		label: 'Guides',
		href: '#',
		dropdown: [
			{ label: 'Client Guide', href: '/guides/client' },
			{ label: 'Server Guide', href: '/guides/server' }
		]
	},
	{
		label: 'Changelog',
		href: '/changelog'
	},
	{
		label: 'Docs',
		href: '/docs'
	},
	{
		label: 'Admin',
		href: '#',
		adminOnly: true,
		dropdown: [
			{ label: 'Analytics', href: '/dashboard/analytics' },
			{ label: 'User Management', href: '/dashboard/users' },
			{ label: 'Settings', href: '/dashboard/settings' }
		]
	},
	{
		label: 'Contact',
		href: '#',
		dropdown: [
			{ label: 'Sales', href: '/sales' },
			{ label: 'Support', href: '/support' }
		]
	},
	{
		label: 'Dashboard',
		href: '/dashboard',
		button: true,
		buttonStyle: 'secondary'
	},
	{
		label: 'Sign out',
		href: '/api/auth/signout',
		button: true,
		buttonStyle: 'secondary'
	}
]
