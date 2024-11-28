'use server'

import { eq } from 'drizzle-orm'
import { cookies } from 'next/headers'
import { createEntity } from '../server/db/generics/entity'
import { sessions } from '../server/db/schema'

const sessionEntity = createEntity(sessions)

export async function logoutMutation() {
	try {
		const token = (await cookies()).get('auth_token')?.value
		if (token) {
			await sessionEntity.delete(eq(sessions.token, token))
			;(await cookies()).delete('auth_token')
		}
		return { success: true }
	} catch (error) {
		console.error('Logout error:', error)
		return { success: false, error: 'Logout failed' }
	}
}
