'use server'

import { activityLogs, users } from '@/features/authentication'
import {
	ActivityStatus,
	DeviceInfo,
	SecurityEvent,
	SecurityEventType,
	UserLocation,
	UserProfile
} from '@/features/authentication/types'
import { calculateSecurityScore } from '@/features/dashboard/security'
import { db } from 'db'
import { desc, eq } from 'drizzle-orm'
import { cookies } from 'next/headers'
import { verifyJWT } from '../utilities'
function getUserAgent(userAgent: string): DeviceInfo {
	return {
		browser: userAgent.split(' ')[0] || 'Unknown',
		os: userAgent.split(' ')[1] || 'Unknown',
		device: userAgent.split(' ')[2] || 'Desktop',
		lastUsed: new Date(),
		isMobile: userAgent.toLowerCase().includes('mobile')
	}
}

export async function getUserData(): Promise<UserProfile | null> {
	try {
		const cookieStore = await cookies()
		const token = cookieStore.get('auth_token')?.value

		if (!token) return null

		const payload = (await verifyJWT(token)) as { userId: number }
		if (!payload) return null

		// Get base user data from DB
		const [dbUser] = await db
			.select()
			.from(users)
			.where(eq(users.id, payload.userId))

		if (!dbUser) return null

		const recentActivity = await db
			.select()
			.from(activityLogs)
			.where(eq(activityLogs.userId, dbUser.id))
			.orderBy(desc(activityLogs.createdAt))
			.limit(5)

		const formattedActivity: SecurityEvent[] = recentActivity.map(
			(log) => ({
				type: log.type as SecurityEventType,
				timestamp: log.createdAt,
				details: {
					message: log.details?.message || log.status,
					location: log.location
						? (log.location as UserLocation)
						: null,
					device: log.userAgent ? getUserAgent(log.userAgent) : null,
					success: log.status === 'success'
				},
				status: log.status as ActivityStatus,
				ipAddress: log.ipAddress || null
			})
		)

		const lastLocation: UserLocation = recentActivity[0]?.location
			? {
					city: recentActivity[0].location.city ?? 'Unknown',
					country: recentActivity[0].location.country ?? 'Unknown',
					lastUpdated: recentActivity[0].createdAt,
					region: recentActivity[0].location.region,
					latitude: recentActivity[0].location.latitude,
					longitude: recentActivity[0].location.longitude
				}
			: {
					city: 'Unknown',
					country: 'Unknown',
					lastUpdated: new Date()
				}

		const lastDevice: DeviceInfo | null = recentActivity[0]?.userAgent
			? getUserAgent(recentActivity[0].userAgent)
			: null

		// Get all unique devices from activity logs
		const devices: DeviceInfo[] = Array.from(
			new Set(
				recentActivity
					.filter((log) => log.userAgent)
					.map((log) => getUserAgent(log.userAgent!))
			)
		)

		// Get all unique trusted locations
		const trustedLocations: UserLocation[] = Array.from(
			new Set(
				recentActivity
					.filter((log) => log.location)
					.map((log) => log.location as UserLocation)
			)
		)

		// Calculate login statistics
		const loginStats = recentActivity.reduce(
			(acc, log) => ({
				totalLogins:
					acc.totalLogins +
					(log.type === 'login' && log.status === 'success' ? 1 : 0),
				failedLoginAttempts:
					acc.failedLoginAttempts +
					(log.type === 'login' && log.status === 'error' ? 1 : 0),
				loginStreak: calculateLoginStreak(recentActivity)
			}),
			{ totalLogins: 0, failedLoginAttempts: 0, loginStreak: 0 }
		)

		// Combine all data into UserProfile type
		const enrichedUser: UserProfile = {
			id: dbUser.id,
			email: dbUser.email,
			name: dbUser.name || null,
			role: dbUser.role as 'user' | 'admin',
			createdAt: dbUser.createdAt,
			emailVerified: dbUser.emailVerified ?? false,
			lastLoginAttempt: dbUser.lastLoginAttempt || null,
			lastLocation,
			lastDevice,
			recentActivity: formattedActivity,
			securityScore: 0,
			loginStreak: loginStats.loginStreak,
			totalLogins: loginStats.totalLogins,
			failedLoginAttempts: loginStats.failedLoginAttempts,
			devices,
			trustedLocations,
			bio: null,
			phoneNumber: null,
			location: null,
			website: null,
			avatarUrl: null
		}

		// Calculate security score after all data is assembled
		const userDataForScoring = {
			...enrichedUser,
			emailVerified: Boolean(enrichedUser.emailVerified),
			lastLoginAttempt: enrichedUser.lastLoginAttempt || undefined
		}
		enrichedUser.securityScore = calculateSecurityScore(userDataForScoring)

		return enrichedUser
	} catch (error) {
		console.error('Error getting user data:', error)
		return null
	}
}

function calculateLoginStreak(
	activities: (typeof activityLogs.$inferSelect)[]
): number {
	let streak = 0
	const today = new Date()
	const oneDayMs = 24 * 60 * 60 * 1000

	for (let i = 0; i < activities.length; i++) {
		const activity = activities[i]
		if (activity.type !== 'login' || activity.status !== 'success') continue

		const daysDiff = Math.floor(
			(today.getTime() - activity.createdAt.getTime()) / oneDayMs
		)
		if (daysDiff <= streak + 1) {
			streak = daysDiff
		} else {
			break
		}
	}

	return streak
}
