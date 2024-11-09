/**
 * @description This hook checks if the current user is an admin and provides the user state and loading status.
 * @author Remco Stoeten
 */

'use client'

import { useUser } from './use-user'

export function useAdmin() {
	const { user, loading } = useUser()

	return {
		isAdmin: user?.role === 'admin',
		loading,
		user
	}
}
