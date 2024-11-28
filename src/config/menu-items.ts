type DropdownItem = {
	label: string
	href: string
	status?: 'beta' | 'demo' | 'soon' | 'new' | 'coming-soon'
}

type NavItem = {
	label: string
	href: string
	dropdown?: DropdownItem[]
	button?: boolean
	buttonStyle?: 'primary' | 'secondary'
	shortcut?: string
	shortcutLabel?: string
	indicatorStyle?: 'triangle'
	adminOnly?: boolean
	status?: 'beta' | 'demo' | 'soon' | 'new' | 'coming-soon'
	debug?: boolean
}

type PrivateNavConfig = {
	items: NavItem[]
	debug: boolean
	isAuthenticated: boolean
	userRole?: 'admin' | 'user'
}

/**
 * @todo
 * - Add a differnet menu when the user is authenticated */
export const publicNavItems: NavItem[] = [
	{
		label: 'Documentation',
		href: '#',
		dropdown: [
			{ label: 'Client example', href: '/guides/client', status: 'beta' },
			{ label: 'Server example', href: '/guides/server', status: 'demo' }
		]
	},
	{
		label: 'Changelog',
		href: '/changelog',
		status: 'soon'
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

/**
 * @todo
 * - Has to be implemented for authenticated different menu
 */
export const privateNavItems: NavItem[] = [
	{
		label: 'Guides',
		href: '#',
		dropdown: [
			{ label: 'Client Guide', href: '/guides/client' },
			{ label: 'Server Guide', href: '/guides/server' }
		],
		debug: true
	},
	{
		label: 'Changelog',
		href: '/changelog'
	},
	{
		label: 'Docs',
		href: '/docs',
		status: 'beta'
	},
	{
		label: 'Roadmap',
		href: '/roadmap',
		status: 'coming-soon'
	},
	{
		label: 'Admin',
		href: '#',
		adminOnly: true,
		dropdown: [
			{
				label: 'Analytics',
				href: '/dashboard/analytics',
				status: 'coming-soon'
			},
			{ label: 'User Management', href: '/dashboard/users' },
			{ label: 'Settings', href: '/dashboard/settings', status: 'beta' }
		]
	},
	{
		label: 'Contact',
		href: '#',
		dropdown: [
			{ label: 'Sales', href: '/sales', status: 'coming-soon' },
			{ label: 'Support', href: '/support' }
		]
	},
	{
		label: 'Dashboard',
		href: '/dashboard',
		button: true,
		buttonStyle: 'secondary',
		status: 'new'
	},
	{
		label: 'Sign out',
		href: '/api/auth/signout',
		button: true,
		buttonStyle: 'secondary'
	},
	{
		label: 'Debug Menu',
		href: '/debug',
		debug: true,
		status: 'beta',
		adminOnly: true
	}
]

export const privateNavConfig: PrivateNavConfig = {
	items: privateNavItems,
	debug: true,
	isAuthenticated: false,
	userRole: 'user'
} as const
