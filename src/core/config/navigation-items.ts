type NavItem = {
	label: string
	href: string
	dropdown?: { label: string; href: string }[]
	button?: boolean
	buttonStyle?: 'secondary' | 'invert'
	shortcut?: string
}

export const publicNavItems: NavItem[] = [
	{
		label: 'Guides',
		href: '#',
		dropdown: [
			{ label: 'Client Guide', href: '/client-guide' },
			{ label: 'Server Guide', href: '/server-guide' },
			{ label: 'Documentation', href: '/docs' }
		]
	},
	{
		label: 'Log in',
		href: '/sign-in',
		button: true,
		buttonStyle: 'secondary',
		shortcut: 'L'
	},
	{
		label: 'Sign up',
		href: '/sign-up',
		button: true,
		buttonStyle: 'invert'
	}
]

export const privateNavItems: NavItem[] = [
	{
		label: 'Guides',
		href: '#',
		dropdown: [
			{ label: 'Client Guide', href: '/client-guide' },
			{ label: 'Server Guide', href: '/server-guide' },
			{ label: 'Documentation', href: '/docs' }
		]
	},
	{
		label: 'Account',
		href: '/dashboard',
		button: true,
		buttonStyle: 'secondary'
	},
	{
		label: 'Sign out',
		href: '#',
		button: true,
		buttonStyle: 'invert'
	}
]
