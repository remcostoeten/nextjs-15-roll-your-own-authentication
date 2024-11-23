export type MenuItemDropdown = {
	label: string
	href: string
	description?: string
	icon?: React.ReactNode
	badge?: string
}

export type MenuItem = {
	label: string
	href: string
	isNew?: boolean
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
