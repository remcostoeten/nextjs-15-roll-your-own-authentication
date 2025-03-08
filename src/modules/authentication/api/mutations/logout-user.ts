import { db } from '@/server/db'
import { sessions } from '@/server/db/schemas'
import { verifyRefreshToken } from '@/shared/utils/jwt'
import { eq } from 'drizzle-orm'

export async function logoutUser(refreshToken?: string) {
	if (refreshToken) {
		try {
			const payload = await verifyRefreshToken(refreshToken)

			// Delete the session with this refresh token
			await db
				.delete(sessions)
				.where(eq(sessions.refreshToken, refreshToken))
		} catch (error) {
			// Continue even if token verification fails
			// We still want to acknowledge the logout
		}
	}

	return { success: true }
}
