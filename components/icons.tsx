import {
	User,
	Settings,
	Bell,
	LogOut,
	Loader2,
	type LucideIcon,
} from 'lucide-react'

export type Icon = LucideIcon

export const Icons = {
	user: User,
	settings: Settings,
	bell: Bell,
	logout: LogOut,
	spinner: Loader2,
} as const
