'use server'

import { getSession } from '@/features/auth/session'

/**
 * Server-side utility to check if the current user is an admin
 * @returns Promise<boolean>
 */
export async function isAdmin(): Promise<boolean> {
	const session = await getSession()
	return session?.role === 'admin'
}
