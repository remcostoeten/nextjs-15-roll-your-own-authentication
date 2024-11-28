import { eq } from 'drizzle-orm'
import { cookies } from 'next/headers'
import { db } from '../../server/db/drizzle'
import { sessions } from '../../server/db/schema'

export async function logoutUser() {
	const token = (await cookies()).get('auth_token')?.value
	if (token) {
		await db.delete(sessions).where(eq(sessions.token, token)).execute()
		;(await cookies()).delete('auth_token')
	}
}
