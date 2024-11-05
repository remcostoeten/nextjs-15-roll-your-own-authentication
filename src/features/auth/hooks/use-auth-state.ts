'use client'

import { useEffect, useState } from 'react'
import { getAuthState } from '../helper/get-auth-state'
import type { SessionUser } from '../types'

type AuthState = {
	isAuthenticated: boolean
	user?: SessionUser
}

export function useAuthState(initialState: AuthState) {
	const [authState, setAuthState] = useState<AuthState>(initialState)

	useEffect(() => {
		const updateAuthState = async () => {
			const newState = await getAuthState()
			setAuthState(newState)
		}

		window.addEventListener('auth-change', updateAuthState)
		updateAuthState()

		return () => {
			window.removeEventListener('auth-change', updateAuthState)
		}
	}, [])

	return authState
}
