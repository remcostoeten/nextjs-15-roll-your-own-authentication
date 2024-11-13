'use server'

import { getSession } from './get-session'

export async function isAuthenticated() {
	const session = await getSession()
	return session !== null
}
