'use client'

import { useUser } from './use-user'

/**
 * Hook to check if the current user has admin privileges
 * @returns Object containing admin status and loading state
 */
export function useAdmin() {
	const { user, loading } = useUser()

	return {
		isAdmin: user?.role === 'admin',
		loading,
		user
	}
}
