import {
	BookOpen,
	Box,
	Cpu,
	Database,
	FileText,
	Home,
	Layout,
	Mail,
	Shield,
	Users
} from 'lucide-react'
import { MenuItem } from './header'
export const defaultMenuItems: MenuItem[] = [
	{
		label: 'Home',
		href: '/',
		icon: <Home className="w-4 h-4" />
	},
	{
		label: 'Pages',
		href: '#',
		icon: <Layout className="w-4 h-4" />,
		dropdownItems: [
			{
				label: 'About',
				href: '/about',
				description: 'Learn more about our company',
				icon: <Users className="w-4 h-4" />
			},
			{
				label: 'Contact',
				href: '/contact',
				description: 'Get in touch with our team',
				icon: <Mail className="w-4 h-4" />
			},
			{
				label: 'Privacy',
				href: '/privacy',
				description: 'Our privacy commitments',
				icon: <Shield className="w-4 h-4" />
			}
		]
	},
	{
		label: 'Components',
		href: '#',
		icon: <Layout className="w-4 h-4" />,
		dropdownItems: [
			{
				label: 'UI Kit',
				href: '/components/ui',
				description: 'Essential interface elements',
				icon: <Box className="w-4 h-4" />
			},
			{
				label: 'Advanced',
				href: '/components/advanced',
				description: 'Complex interactive components',
				icon: <Cpu className="w-4 h-4" />
			},
			{
				label: 'Data Display',
				href: '/components/data',
				description: 'Tables and data visualization',
				icon: <Database className="w-4 h-4" />
			}
		]
	},
	{
		label: 'Blog',
		href: '/blog',
		icon: <FileText className="w-4 h-4" />,
		dropdownItems: [
			{
				label: 'Articles',
				href: '/blog/articles',
				description: 'Latest posts and updates'
			},
			{
				label: 'Tutorials',
				href: '/blog/tutorials',
				description: 'Step-by-step guides'
			},
			{
				label: 'Resources',
				href: '/blog/resources',
				description: 'Helpful tools and links'
			}
		]
	},
	{
		label: 'Docs',
		href: '/docs',
		icon: <BookOpen className="w-4 h-4" />,
		isNew: true
	}
]
