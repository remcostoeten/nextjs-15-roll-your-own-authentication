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
	initialUser = null,
	initialIsAuthenticated = false 
}: { 
	children: React.ReactNode
	initialUser?: SessionUser | null
	initialIsAuthenticated?: boolean
}) {
	const [isAuthenticated, setIsAuthenticated] = useState(initialIsAuthenticated)
	const [user, setUser] = useState<SessionUser | null>(initialUser)
	const router = useRouter()

	const signIn = async (credentials: any) => {
		try {
			const response = await fetch('/api/auth/signin', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(credentials)
			})
			
			if (!response.ok) throw new Error('Sign in failed')
			
			const data = await response.json()
			setIsAuthenticated(true)
			setUser(data.user)
			router.refresh() // Force a router refresh to update server components
			router.push('/dashboard')
		} catch (error) {
			console.error('Sign in error:', error)
			throw error
		}
	}

	const signOut = async () => {
		try {
			await fetch('/api/auth/signout', { method: 'POST' })
			setIsAuthenticated(false)
			setUser(null)
			router.refresh() // Force a router refresh to update server components
			router.push('/')
		} catch (error) {
			console.error('Sign out error:', error)
		}
	}

	// Check auth status on mount and after route changes
	useEffect(() => {
		const checkAuth = async () => {
			try {
				const response = await fetch('/api/auth/session')
				const data = await response.json()
				setIsAuthenticated(!!data.user)
				setUser(data.user)
			} catch (error) {
				console.error('Auth check error:', error)
			}
		}

		checkAuth()
	}, [])

	return (
		<AuthContext.Provider value={{ isAuthenticated, user, signIn, signOut }}>
			{children}
		</AuthContext.Provider>
	)
}

export const useAuth = () => useContext(AuthContext)
