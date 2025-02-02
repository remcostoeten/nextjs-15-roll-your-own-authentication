export interface HeaderProps {
	className?: string
}

export interface MenuItem {
	label: string
	href: string
	icon?: React.ReactNode
	isNew?: boolean
	isSoon?: boolean
	isBeta?: boolean
	dropdownItems?: DropdownItem[]
}

export interface DropdownItem {
	label: string
	href: string
	description?: string
	isNew?: boolean
	isSoon?: boolean
	isBeta?: boolean
}

export type MenuItemDropdown = {
	label: string
	href: string
	description?: string
	icon?: React.ReactNode
	isBeta?: boolean
	isSoon?: boolean
	isNew?: boolean
}

export type NavbarProps = {
	logo?: React.ReactNode
	menuItems?: MenuItem[]
}
