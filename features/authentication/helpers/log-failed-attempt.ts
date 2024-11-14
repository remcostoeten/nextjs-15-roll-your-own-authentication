'use server'

import { db } from 'db'
import type { ActivityType } from '../activity-logs/schema'
import { activityLogs } from '../activity-logs/schema'
import { ActivityStatus, SecurityEventType } from '../types'

export type LogFailedAttemptProps = {
	userId?: number
	email: string
	ip?: string | null
	reason?: string
	type?: SecurityEventType
}

export async function logFailedAttempt({
	userId,
	email,
	ip,
	reason = 'Invalid credentials',
	type = 'failed_login'
}: LogFailedAttemptProps) {
	try {
		const activityLog = {
			userId: 0, // Default to 0 for system-generated logs
			type: type as ActivityType,
			status: 'error' as ActivityStatus,
			details: {
				message: reason,
				metadata: { email }
			},
			ipAddress: ip ?? null,
			createdAt: new Date()
		}

		if (userId) {
			activityLog.userId = userId
		}

		await db.insert(activityLogs).values(activityLog)
	} catch (error) {
		console.error('Error logging failed attempt:', error)
	}
}
