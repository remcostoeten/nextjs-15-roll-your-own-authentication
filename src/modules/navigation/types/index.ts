import type { ComponentType } from 'react'

export interface NavSubItem {
	name: string
	href: string
	description?: string
}

export interface NavItem {
	name: string
	href: string
	icon?: ComponentType
	description?: string
	isDropdown?: boolean
	items?: NavSubItem[]
}

export interface NavItemProps {
	href: string
	text: string
	description?: string
	icon?: ComponentType
	isActive?: boolean
}
