import { db } from '@/server/db'
import { users, sessions } from '@/server/db/schemas'
import { verifyRefreshToken, generateTokens } from '@/shared/utils/jwt'
import { eq } from 'drizzle-orm'

export async function refreshToken(
	token: string,
	requestInfo?: {
		userAgent?: string
		ipAddress?: string
	}
) {
	if (!token) {
		throw new Error('Refresh token is required')
	}

	try {
		// Verify the refresh token
		const payload = await verifyRefreshToken(token)

		// Find the session with this refresh token
		const session = await db.query.sessions.findFirst({
			where: eq(sessions.refreshToken, token),
			with: {
				user: true,
			},
		})

		if (!session) {
			throw new Error('Invalid refresh token')
		}

		// Check if the token is expired
		if (new Date() > session.expiresAt) {
			// Delete the expired session
			await db.delete(sessions).where(eq(sessions.id, session.id))

			throw new Error('Refresh token expired')
		}

		// Generate new tokens
		const tokens = await generateTokens({
			sub: payload.sub,
			email: payload.email,
		})

		// Calculate new expiration date
		const expiresAt = new Date()
		expiresAt.setDate(expiresAt.getDate() + 7)

		// Delete the old session
		await db.delete(sessions).where(eq(sessions.id, session.id))

		// Create a new session with the new refresh token
		await db.insert(sessions).values({
			userId: payload.sub,
			refreshToken: tokens.refreshToken,
			expiresAt,
			userAgent: requestInfo?.userAgent || session.userAgent,
			ipAddress: requestInfo?.ipAddress || session.ipAddress,
		})

		// Find user details
		const user = await db.query.users.findFirst({
			where: eq(users.id, payload.sub),
			columns: {
				id: true,
				email: true,
				firstName: true,
				lastName: true,
			},
		})

		return {
			user,
			tokens,
		}
	} catch (error) {
		throw error
	}
}
