'use server'

import { getUser } from './get-user'

/**
 * Server function to check if the current user has admin privileges
 * @returns Promise<boolean>
 */
export async function isAdmin(): Promise<boolean> {
	const user = await getUser()
	return user?.role === 'admin'
}
