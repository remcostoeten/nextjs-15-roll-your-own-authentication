'use server'

import { JWT_SECRET } from '@/app/server/utilities'
import { activityLogs, sessions, users } from '@/features/authentication'
import { db } from 'db'
import { desc, eq } from 'drizzle-orm'
import { jwtVerify } from 'jose'
import { cookies } from 'next/headers'

export async function getUserData() {
	const token = (await cookies()).get('auth_token')?.value
	if (!token) return null

	try {
		const verified = await jwtVerify(token, JWT_SECRET, {
			clockTolerance: 300
		})

		const userId = verified.payload.userId as number

		// Get user and session data
		const [userWithSession] = await db
			.select({
				id: users.id,
				email: users.email,
				role: users.role,
				emailVerified: users.emailVerified,
				lastLoginAttempt: users.lastLoginAttempt,
				createdAt: users.createdAt,
				lastLocation: sessions.lastLocation,
				lastDevice: sessions.deviceInfo
			})
			.from(users)
			.leftJoin(sessions, eq(users.id, sessions.userId))
			.where(eq(users.id, userId))
			.limit(1)

		if (!userWithSession) {
			;(await cookies()).delete('auth_token')
			return null
		}

		// Fetch recent activities separately
		const recentActivities = await db
			.select({
				type: activityLogs.type,
				timestamp: activityLogs.createdAt,
				details: activityLogs.details,
				status: activityLogs.status
			})
			.from(activityLogs)
			.where(eq(activityLogs.userId, userId))
			.orderBy(desc(activityLogs.createdAt))
			.limit(5)

		return {
			...userWithSession,
			recentActivity: recentActivities
		}
	} catch (error) {
		console.error('Token verification error:', error)
		;(await cookies()).delete('auth_token')
		return null
	}
}
