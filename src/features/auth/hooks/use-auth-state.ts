'use client'

import { useEffect, useState } from 'react'
import { getAuthState } from '../helper/get-auth-state'
import type { SessionUser } from '../types'

type AuthState = {
	isAuthenticated: boolean
	user?: SessionUser
	isLoading: boolean
	error?: string
}

type AuthStateProps = {
	isAuthenticated: boolean
	initialUser?: SessionUser
}

export function useAuthState({
	isAuthenticated,
	initialUser
}: AuthStateProps): AuthState {
	const [authState, setAuthState] = useState<AuthState>({
		isAuthenticated,
		user: initialUser,
		isLoading: !initialUser
	})

	useEffect(() => {
		let mounted = true

		const updateAuthState = async () => {
			try {
				const newState = await getAuthState()
				if (mounted) {
					setAuthState({
						...newState,
						isLoading: false
					})
				}
			} catch (error) {
				if (mounted) {
					setAuthState((state) => ({
						...state,
						isLoading: false,
						error:
							error instanceof Error
								? error.message
								: 'Failed to update auth state'
					}))
				}
				console.error('Failed to update auth state:', error)
			}
		}

		window.addEventListener('auth-change', updateAuthState)
		if (!initialUser) {
			updateAuthState()
		}

		return () => {
			mounted = false
			window.removeEventListener('auth-change', updateAuthState)
		}
	}, [initialUser])

	return authState
}
