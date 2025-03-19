'use client'

import { useAuth } from './use-auth'

type Role = 'admin' | 'user'

/**
 * Hook to check user permissions and roles
 */
export function usePermissions() {
	const { user } = useAuth()

	/**
	 * Check if the user has a specific role
	 */
	const hasRole = (role: Role): boolean => {
		if (!user) return false
		return user.role === role
	}

	/**
	 * Check if the user can perform a specific action
	 * This can be expanded with more granular permissions in the future
	 */
	const can = (action: string): boolean => {
		if (!user) return false

		// Admin can do everything
		if (user.role === 'admin') return true

		// Add more specific permission checks here as needed
		switch (action) {
			case 'view_profile':
			case 'edit_profile':
				return true
			case 'access_admin':
				return user.role === 'admin'
			default:
				return false
		}
	}

	return {
		hasRole,
		can,
		isAdmin: user?.role === 'admin' || false,
	}
}
