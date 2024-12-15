'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { getUser, logout } from '@/server/mutations/auth'
import type { User } from '@/shared/hooks/use-auth'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { useAuth } from '@/shared/hooks/use-auth'

type UserContextType = {
	user: User | null
	setUser: (user: User | null) => void
	isLoading: boolean
	logout: () => Promise<void>
	refreshUser: () => Promise<void>
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export default function UserProvider({
	children
}: {
	children: React.ReactNode
}) {
	const [user, setUser] = useState<User | null>(null)
	const [isLoading, setIsLoading] = useState(true)
	const router = useRouter()
	const { setUser: setAuthUser } = useAuth()

	const fetchUser = async () => {
		try {
			const userData = await getUser()
			if (userData) {
				setUser(userData)
				setAuthUser(userData)
			} else {
				setUser(null)
				setAuthUser(null)
				// If we're on a protected route and there's no user, redirect to login
				if (window.location.pathname.startsWith('/dashboard')) {
					router.push('/login')
				}
			}
		} catch (error) {
			console.error('Error fetching user:', error)
			setUser(null)
			setAuthUser(null)
		} finally {
			setIsLoading(false)
		}
	}

	useEffect(() => {
		fetchUser()
	}, [])

	// Add a listener for storage events to handle cross-tab synchronization
	useEffect(() => {
		const handleStorageChange = (event: StorageEvent) => {
			if (event.key === 'auth-storage') {
				fetchUser()
			}
		}

		window.addEventListener('storage', handleStorageChange)
		return () => window.removeEventListener('storage', handleStorageChange)
	}, [])

	const handleLogout = async () => {
		try {
			const result = await logout()

			if (!result.success) {
				toast.error(result.error || 'Logout failed')
				throw new Error(result.error || 'Logout failed')
			}

			setUser(null)
			setAuthUser(null)
			toast.success('Successfully logged out')
			router.push('/login')
		} catch (error) {
			console.error('Logout error:', error)
			toast.error('An error occurred during logout')
			throw error
		}
	}

	const value = {
		user,
		setUser,
		isLoading,
		logout: handleLogout,
		refreshUser: fetchUser
	}

	return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}

export function useUser() {
	const context = useContext(UserContext)
	if (context === undefined) {
		throw new Error('useUser must be used within a UserProvider')
	}
	return context
}
