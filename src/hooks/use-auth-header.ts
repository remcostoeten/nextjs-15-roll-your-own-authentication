'use client'

import { logout } from '@/mutations/auth'
import { getUserMutation } from '@/mutations/user'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
const scrollConfig = {
	threshold: 20,
	hideThreshold: 60,
	debounceDelay: 10
}

type User = {
	id: number
	name?: string
	email: string
	image?: string
	role?: string
} | null
const HeaderAnimations = {
	container: {
		initial: {
			backgroundColor: 'rgba(0, 0, 0, 0)',
			backdropFilter: 'blur(0px)'
		},
		scrolled: {
			backgroundColor: 'rgba(0, 0, 0, 0.7)',
			backdropFilter: 'blur(12px)'
		}
	},
	nav: {
		initial: {
			y: 0,
			opacity: 1,
			scale: 1,
			borderRadius: '16px'
		},
		scrolled: {
			y: 0,
			opacity: 1,
			scale: 1,
			borderRadius: '0px'
		},
		hidden: {
			opacity: 0,
			width: '100vw',
			scale: 0.95
		}
	},
	transition: {
		duration: 1.3,
		ease: [0.22, 0.1, 0.36, 0.1]
	}
}

export type HeaderAnimationState = 'initial' | 'scrolled' | 'hidden'

export type UseAuthHeaderReturn = {
	user: User
	signOut: () => void
}

export default function useAuthHeader(): UseAuthHeaderReturn {
	const [user, setUser] = useState<User>(null)
	const [isLoading, setIsLoading] = useState(true)
	const [animationState, setAnimationState] =
		useState<HeaderAnimationState>('initial')
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
	const [openDropdown, setOpenDropdown] = useState<string | null>(null)
	const [isSearchOpen, setIsSearchOpen] = useState(false)
	const [lastScrollY, setLastScrollY] = useState(0)
	const { theme, setTheme } = useTheme()

	useEffect(() => {
		const fetchUser = async () => {
			try {
				const result = await getUserMutation()
				if (result.success && result.user) {
					setUser({
						id: result.user.id,
						email: result.user.email,
						role: result.user.role,
						name: result.user.email // Fallback to email if name not available
					})
				}
			} catch (error) {
				console.error('Failed to fetch user:', error)
			} finally {
				setIsLoading(false)
			}
		}
		fetchUser()
	}, [])

	useEffect(() => {
		let ticking = false

		const updateHeaderState = () => {
			const currentScrollY = window.scrollY

			// Determine animation stat e based on scroll position and direction
			if (currentScrollY < scrollConfig.threshold) {
				setAnimationState('initial')
			} else if (
				currentScrollY > lastScrollY &&
				currentScrollY > scrollConfig.hideThreshold
			) {
				setAnimationState('hidden')
			} else {
				setAnimationState('scrolled')
			}

			setLastScrollY(currentScrollY)
			ticking = false
		}

		const onScroll = () => {
			if (!ticking) {
				window.requestAnimationFrame(() => {
					updateHeaderState()
					ticking = false
				})
				ticking = true
			}
		}

		window.addEventListener('scroll', onScroll, { passive: true })
		return () => window.removeEventListener('scroll', onScroll)
	}, [lastScrollY])

	const handleLogout = async () => {
		try {
			const result = await logout()
			if (result.success) {
				setUser(null)
				setIsMobileMenuOpen(false)
			}
		} catch (error) {
			console.error('Logout error:', error)
		}
	}

	return {
		user,
		signOut: handleLogout
	}
}
