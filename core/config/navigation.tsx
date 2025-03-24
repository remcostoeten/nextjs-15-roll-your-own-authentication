import { Code } from 'lucide-react'

export const navItems = [
	{ name: '_changelog', href: '/changelog' },
	{ name: '_docs', href: '/docs' },
	{ name: '_roadmap', href: '/roadmap' },
	{
		name: '_demos',
		href: '#',
		isDropdown: true,
		items: [
			{
				name: 'JWT Authentication',
				href: '/demos/jwt',
				description: 'Implement secure JWT tokens without dependencies',
			},
			{
				name: 'OAuth Integration',
				href: '/demos/oauth',
				description: 'Build your own OAuth provider connections',
			},
			{
				name: 'Password Hashing',
				href: '/demos/password',
				description: 'Secure password storage with PBKDF2',
			},
		],
	},
]
