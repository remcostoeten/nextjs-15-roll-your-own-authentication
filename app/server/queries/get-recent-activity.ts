'use server'

import { activityLogs } from '@/features/authentication'
import { db } from 'db'
import { desc, eq } from 'drizzle-orm'

export async function getRecentActivity(userId?: number, limit = 5) {
	if (!userId) return []

	try {
		const activities = await db
			.select({
				type: activityLogs.type,
				status: activityLogs.status,
				createdAt: activityLogs.createdAt,
				details: activityLogs.details,
				ipAddress: activityLogs.ipAddress,
				userAgent: activityLogs.userAgent
			})
			.from(activityLogs)
			.where(eq(activityLogs.userId, userId))
			.orderBy(desc(activityLogs.createdAt))
			.limit(limit)

		return activities
	} catch (error) {
		console.error('Failed to get recent activity:', error)
		return []
	}
}
