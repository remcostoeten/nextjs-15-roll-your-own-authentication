export type MenuItem = {
	label: string
	href?: string
	items?: DropdownItem[]
	dropdownItems?: DropdownItem[]
	icon?: React.ReactNode
	isNew?: boolean
	isSoon?: boolean
	isBeta?: boolean
}

export type DropdownItem = {
	label: string
	href: string
	description?: string
	isBeta?: boolean
	isSoon?: boolean
}

export type HeaderProps = {
	user?: {
		name: string
		email: string
		avatar: string
	}
	onSignOut?: () => void
}

export type SiteConfig = {
	name: string
	description: string
	links: {
		github: string
	}
}
