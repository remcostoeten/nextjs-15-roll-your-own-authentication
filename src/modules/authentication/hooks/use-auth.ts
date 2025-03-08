'use client'

import { useEffect } from 'react'
import { useAuthStore } from '../state/use-auth-state'

export function useAuth() {
	const {
		user,
		isAuthenticated,
		isLoading,
		error,
		login,
		register,
		logout,
		refreshAuth,
		fetchUser,
	} = useAuthStore()

	// Fetch user on mount
	useEffect(() => {
		if (!user && !isLoading) {
			fetchUser().catch(() => {
				// Silent catch - errors are handled in the store
			})
		}
	}, [user, isLoading, fetchUser])

	return {
		user,
		isAuthenticated,
		isLoading,
		error,
		login,
		register,
		logout,
		refreshAuth,
	}
}
