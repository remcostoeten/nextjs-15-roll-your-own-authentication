import type { MenuItem } from './header.d'

export const MENU_ITEMS: MenuItem[] = [
	{
		label: 'Docs',
		href: '#',
		items: [
			{
				label: 'Getting Started',
				href: '/docs/getting-started',
				description: 'Quick start guide and installation'
			},
			{
				label: 'Components',
				href: '/docs/components',
				description: 'UI components and usage examples'
			},
			{
				label: 'Authentication',
				href: '/docs/auth',
				description: 'User authentication and authorization',
				isBeta: true
			},
			{
				label: 'API Reference',
				href: '/docs/api',
				description: 'Complete API documentation'
			},
			{
				label: 'Deployment',
				href: '/docs/deployment',
				description: 'Deploy your application',
				isSoon: true
			}
		]
	},
	{
		label: 'Changelog',
		href: '/changelog',
		isNew: true
	},
	{
		label: 'Roadmap',
		href: '/roadmap',
		isSoon: true
	},
	{
		label: 'Demos',
		href: '#',
		dropdownItems: [
			{
				label: 'Logo',
				href: '/logo',
				description: 'Logo demo'
			},
			{
				label: 'Square',
				href: '/square',
				description: 'Square demo'
			},
			{
				label: 'Squares',
				href: '/squares',
				description: 'Squares demo'
			},
			{
				label: 'Toast showcase',
				href: '/toast-showcase',
				description: 'Toast showcase'
			}
		]
	}
]
