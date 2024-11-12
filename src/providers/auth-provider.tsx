'use client'

import { SessionUser } from '@/features/auth/types'
import { useRouter } from 'next/navigation'
import { createContext, useContext, useEffect, useState } from 'react'

type AuthContextType = {
	isAuthenticated: boolean
	user: SessionUser | null
	signIn: (credentials: any) => Promise<void>
	signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
	isAuthenticated: false,
	user: null,
	signIn: async () => {},
	signOut: async () => {}
})

export function AuthProvider({
	children,
	initialUser
}: {
	children: React.ReactNode
	initialUser: SessionUser | null
}) {
	const [user, setUser] = useState<SessionUser | null>(initialUser)
	const router = useRouter()

	useEffect(() => {
		if (initialUser) {
			setUser(initialUser)
		}
	}, [initialUser])

	async function signIn(credentials: any) {
		try {
			const response = await fetch('/api/auth/sign-in', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(credentials)
			})

			if (!response.ok) {
				throw new Error('Sign in failed')
			}

			const data = await response.json()
			setUser(data.user)
			router.push('/dashboard')
		} catch (error) {
			console.error('Sign in error:', error)
			throw error
		}
	}

	async function signOut() {
		try {
			await fetch('/api/auth/sign-out', { method: 'POST' })
			setUser(null)
			router.push('/sign-in')
		} catch (error) {
			console.error('Sign out error:', error)
		}
	}

	return (
		<AuthContext.Provider
			value={{
				isAuthenticated: !!user,
				user,
				signIn,
				signOut
			}}
		>
			{children}
		</AuthContext.Provider>
	)
}

export function useAuth() {
	return useContext(AuthContext)
}
