'use client'

import { useEffect, useState } from 'react'
import { AuthState, AuthStateHookProps } from '../types'

const defaultState: AuthState = {
	isAuthenticated: false,
	isLoading: false,
	user: null
}

export function useAuthState(props?: AuthStateHookProps): AuthState {
	const [authState, setAuthState] = useState<AuthState>({
		...defaultState,
		isAuthenticated: props?.isAuthenticated ?? false,
		user: props?.initialUser ?? null
	})

	const updateAuthState = async () => {
		try {
			const response = await fetch('/api/auth/state')
			if (!response.ok) {
				throw new Error('Failed to fetch auth state')
			}
			const data = await response.json()
			setAuthState(prev => ({
				...prev,
				...data,
				isLoading: false
			}))
		} catch (error) {
			setAuthState(prev => ({
				...prev,
				isAuthenticated: false,
				user: null,
				isLoading: false,
				error: error instanceof Error ? error.message : 'An error occurred'
			}))
			console.error('Failed to update auth state:', error)
		}
	}

	useEffect(() => {
		updateAuthState()
	}, [])

	return authState
}
