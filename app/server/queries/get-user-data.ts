'use server'

import { JWT_SECRET } from '@/app/server/utilities'
import { activityLogs, sessions, users } from '@/features/authentication'
import { UserData, UserSession } from '@/features/authentication/types'
import { db } from 'db'
import { desc, eq } from 'drizzle-orm'
import { jwtVerify } from 'jose'
import { cookies } from 'next/headers'

export async function getUserData(): Promise<UserData | null> {
	const token = (await cookies()).get('auth_token')?.value
	if (!token) return null

	try {
		const verified = await jwtVerify(token, JWT_SECRET, {
			clockTolerance: 300
		})

		const userId = verified.payload.userId as number

		// Get user data
		const [userData] = await db
			.select({
				id: users.id,
				email: users.email,
				role: users.role,
				emailVerified: users.emailVerified,
				lastLoginAttempt: users.lastLoginAttempt,
				createdAt: users.createdAt,
				passwordChangedAt: users.passwordChangedAt,
				currentSessionToken: sessions.token,
				lastLocation: sessions.lastLocation,
				lastDevice: sessions.deviceInfo
			})
			.from(users)
			.leftJoin(sessions, eq(users.id, sessions.userId))
			.where(eq(users.id, userId))
			.limit(1)

		if (!userData) {
			;(await cookies()).delete('auth_token')
			return null
		}

		// Get all active sessions with proper type transformation
		const activeSessions = await db
			.select({
				id: sessions.id,
				token: sessions.token,
				deviceInfo: sessions.deviceInfo,
				lastActive: sessions.lastActive,
				lastLocation: sessions.lastLocation
			})
			.from(sessions)
			.where(eq(sessions.userId, userId))

		// Transform sessions to match UserSession type
		const transformedSessions: UserSession[] = activeSessions.map(session => ({
			id: String(session.id),
			deviceInfo: {
				browser: session.deviceInfo?.browser || null,
				os: session.deviceInfo?.os || null,
				isMobile: Boolean(session.deviceInfo?.isMobile)
			},
			lastActive: session.lastActive || new Date(),
			lastLocation: session.lastLocation ? {
				city: session.lastLocation.city,
				country: session.lastLocation.country
			} : undefined,
			token: session.token || ''
		}))

		// Fetch recent activities
		const recentActivity = await db
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
			...userData,
			emailVerified: Boolean(userData.emailVerified),
			createdAt: userData.createdAt || new Date(),
			passwordChangedAt: userData.passwordChangedAt || null,
			lastLoginAttempt: userData.lastLoginAttempt || null,
			lastDevice: userData.lastDevice ? {
				browser: userData.lastDevice.browser || null,
				os: userData.lastDevice.os || null,
				isMobile: Boolean(userData.lastDevice.isMobile)
			} : null,
			sessions: transformedSessions,
			recentActivity: recentActivity.map(activity => ({
				type: activity.type,
				timestamp: activity.timestamp,
				details: activity.details || null,
				status: activity.status as 'success' | 'error' | 'pending'
				}))
		}
	} catch (error) {
		console.error('Token verification error:', error)
		;(await cookies()).delete('auth_token')
		return null
	}
}
