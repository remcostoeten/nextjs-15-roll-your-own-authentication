'use server'

import { getUserData } from './get-user-data'

export async function hasRole(requiredRole: string) {
	const userData = await getUserData()
	return userData?.role === requiredRole
}
