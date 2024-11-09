'use server'

import { getSession } from '@/features/auth/session'

export async function isAdminServer(): Promise<boolean> {
	const session = await getSession()
	return session?.role === 'admin'
}
