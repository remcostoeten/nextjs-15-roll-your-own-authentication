import { Home, Users, Bookmark, MessagesSquare, Bell, Settings, type LucideIcon } from 'lucide-react'

export interface NavItem {
	label: string
	href: string
	icon: LucideIcon
	exact?: boolean // whether to only highlight when path matches exactly
}

export const forumNavItems: NavItem[] = [
	{
		label: 'My Feed',
		href: '/forum',
		icon: Home,
		exact: true,
	},
	{
		label: 'Groups',
		href: '/forum/groups',
		icon: Users,
	},
	{
		label: 'Bookmarks',
		href: '/forum/bookmarks',
		icon: Bookmark,
	},
	{
		label: 'Messages',
		href: '/forum/messages',
		icon: MessagesSquare,
	},
	{
		label: 'Notifications',
		href: '/forum/notifications',
		icon: Bell,
	},
	{
		label: 'Settings',
		href: '/forum/settings',
		icon: Settings,
	},
]
