import { db } from 'db'
import { sessions } from '../sessions/schema'

export async function createSession(
	userId: number,
	token: string,
	expiresAt: Date,
	ip: string,
	userAgent: string | null,
	deviceInfo: Record<string, unknown>
) {
	await db.insert(sessions).values({
		userId,
		token,
		expiresAt,
		ipAddress: ip,
		userAgent,
		deviceInfo,
		lastLocation: { ip }
	})
}
