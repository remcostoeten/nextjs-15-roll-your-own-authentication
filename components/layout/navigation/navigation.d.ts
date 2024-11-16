epxort type NavItem = {
	title: string
	href: string
}

export type UserProfile = {
	email: string | null
	role: 'user' | 'admin'
	avatarUrl: string | null
}

export type UserMenuProps = {
	email: string | null
	role: 'user' | 'admin'
	avatarUrl: string | null
}
