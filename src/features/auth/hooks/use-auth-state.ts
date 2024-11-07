'use client'

import { useEffect, useState } from 'react'
import { getAuthState } from '../helper/get-auth-state'
import type { SessionUser } from '../types'

type AuthState = {
	isAuthenticated: boolean
	user?: SessionUser
}

type AuthStateProps = {
	isAuthenticated: boolean
	initialUser?: SessionUser
}

export function useAuthState({ isAuthenticated, initialUser }: AuthStateProps) {
	const [authState, setAuthState] = useState<AuthState>({
		isAuthenticated,
		user: initialUser
	})

	useEffect(() => {
		const updateAuthState = async () => {
			const newState = await getAuthState()
			setAuthState(newState)
		}

		window.addEventListener('auth-change', updateAuthState)
		if (!initialUser) {
			updateAuthState()
		}

		return () => {
			window.removeEventListener('auth-change', updateAuthState)
		}
	}, [initialUser])

	return authState
}
