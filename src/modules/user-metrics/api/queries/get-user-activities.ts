'use server'

import { db } from '@/server/db'
import { activityLogs } from '@/server/db/schemas'
import { eq, desc } from 'drizzle-orm'
import { formatDistanceToNow, isToday, isYesterday } from 'date-fns'

export const getUserActivities = async (userId: string, limit = 5) => {
	const logs = await db.query.activityLogs.findMany({
		where: eq(activityLogs.userId, userId),
		orderBy: [desc(activityLogs.createdAt)],
		limit,
	})

	// Format the logs for display
	return logs.map((log) => ({
		...log,
		timestamp: formatLogTimestamp(log.createdAt),
	}))
}

// Helper function to format activity timestamp
function formatLogTimestamp(date: Date): string {
	if (isToday(date)) {
		return 'Today'
	} else if (isYesterday(date)) {
		return 'Yesterday'
	} else {
		return formatDistanceToNow(date, { addSuffix: true })
	}
}
