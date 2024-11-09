'use client'

import { useUser } from '@/features/auth/hooks/use-user'

export function useAdmin() {
	const { user, loading } = useUser()
	return {
		isAdmin: user?.role === 'admin',
		loading,
		user
	}
}
