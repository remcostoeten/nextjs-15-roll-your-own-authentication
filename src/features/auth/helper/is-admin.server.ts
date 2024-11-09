'use server'

import { getSession } from '../session'

export async function isAdminServer() {
	const session = await getSession()
	return session?.role === 'admin'
}
