/**
 * @description This function checks if the current user is an admin.
 * @author Remco Stoeten
 */

import { getUser } from './get-user'

export async function isAdmin(): Promise<boolean> {
	const user = await getUser()
	return user?.role === 'admin'
}
