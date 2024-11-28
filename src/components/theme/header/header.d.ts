export type MenuItemDropdown = {
	label: string
	href: string
	description?: string
	icon?: React.ReactNode
	isBeta?: boolean
	isSoon?: boolean
	isNew?: boolean
}

export type MenuItem = {
	label: string
	href: string
	isNew?: boolean
	isSoon?: boolean
	isBeta?: boolean
	description?: string
	icon?: React.ReactNode
	dropdownItems?: MenuItemDropdown[]
}

export type NavbarProps = {
	logo?: React.ReactNode
	menuItems?: MenuItem[]
}

export interface DropdownItem {
	label: string
	href: string
	description?: string
}

export type HeaderProps = {
	className?: string
}

interface DropdownItem {
	label: string
	href: string
	description?: string
}
