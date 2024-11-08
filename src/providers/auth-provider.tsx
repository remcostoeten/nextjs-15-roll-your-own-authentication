'use client'

import { getAuthState } from '@/features/auth/helper/get-auth-state'
import type { SessionUser } from '@/features/auth/types'
import { createContext, useContext, useEffect, useState } from 'react'

type AuthState = {
	isAuthenticated: boolean
	user?: SessionUser
	isLoading: boolean
}

type AuthContextType = {
	isAuthenticated: boolean
	user?: SessionUser
	isLoading: boolean
	updateAuthState: (updates: Partial<AuthState>) => void
}

const AuthContext = createContext<AuthContextType>({
	isAuthenticated: false,
	isLoading: true,
	updateAuthState: () => undefined
})

type AuthProviderProps = {
	children: React.ReactNode
	initialUser?: SessionUser
	initialAuthenticated: boolean
}

export function AuthProvider({
	children,
	initialUser,
	initialAuthenticated
}: AuthProviderProps) {
	const [state, setState] = useState<AuthState>({
		isAuthenticated: initialAuthenticated,
		user: initialUser,
		isLoading: !initialUser
	})

	useEffect(() => {
		const handleAuthChange = async () => {
			const newState = await getAuthState()
			setState((current) => ({
				...current,
				...newState,
				isLoading: false
			}))
		}

		window.addEventListener('auth-change', handleAuthChange)
		return () => window.removeEventListener('auth-change', handleAuthChange)
	}, [])

	const value: AuthContextType = {
		...state,
		updateAuthState: (updates) =>
			setState((current) => ({
				...current,
				...updates
			}))
	}

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextType {
	const context = useContext(AuthContext)
	if (!context) {
		throw new Error('useAuth must be used within an AuthProvider')
	}
	return context
}
