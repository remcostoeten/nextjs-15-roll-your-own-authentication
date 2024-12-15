'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getUser } from '@/server/mutations/auth/user/get-user'
import type { UserResponse } from '@/server/mutations/auth/user/types'
import { logout as logoutAction } from '@/server/mutations/auth/user/logout'

type UserContextType = {
	user: UserResponse | null
	setUser: (user: UserResponse | null) => void
	isLoading: boolean
	logout: () => Promise<void>
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export default function UserProvider({
	children
}: {
	children: React.ReactNode
}) {
	const [user, setUser] = useState<UserResponse | null>(null)
	const [isLoading, setIsLoading] = useState(true)
	const router = useRouter()

	useEffect(() => {
		async function fetchUser() {
			try {
				const userData = await getUser()
				if (userData) {
					setUser(userData as unknown as UserResponse | null)
				}
			} catch (error) {
				console.error('Error fetching user:', error)
			} finally {
				setIsLoading(false)
			}
		}

		fetchUser()
	}, [])

	const logout = async () => {
		try {
			await logoutAction()
			setUser(null)
			router.push('/login')
		} catch (error) {
			console.error('Logout error:', error)
		}
	}

	const value = {
		user,
		setUser,
		isLoading,
		logout
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
