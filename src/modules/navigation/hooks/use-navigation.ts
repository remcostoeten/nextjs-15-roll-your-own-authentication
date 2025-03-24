import { useState } from 'react'
import { usePathname } from 'next/navigation'
import type { NavItem } from '../types'

export function useNavigation() {
	const pathname = usePathname()
	const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
	const [matrixEffect, setMatrixEffect] = useState(false)

	const isActive = (href: string) => {
		if (href === '#') return false
		if (href.startsWith('/demos') || href.startsWith('/dev')) {
			return pathname.startsWith('/demos') || pathname.startsWith('/dev')
		}
		return pathname === href
	}

	const handleDropdownEnter = (item: NavItem) => {
		if (item.isDropdown) {
			setActiveDropdown(item.name)
			setMatrixEffect(true)
		}
	}

	const handleDropdownLeave = (item: NavItem) => {
		if (item.isDropdown) {
			setActiveDropdown(null)
			setMatrixEffect(false)
		}
	}

	return {
		activeDropdown,
		matrixEffect,
		isActive,
		handleDropdownEnter,
		handleDropdownLeave,
	} as const
}
