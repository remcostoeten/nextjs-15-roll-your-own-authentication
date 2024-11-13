// logFailedAttempt.ts
'use server'

import { activityLogs } from '@/app/server/schema'
import { db } from 'db'
import { headers } from 'next/headers'
import { ActivityType } from '../activity-logs/schema'

type LogFailedAttemptProps = {
	userId: number
	error?: string
}

type ActivityLogDetails = {
	message: string
	error?: string
	metadata?: Record<string, unknown>
}

/**
 * Gets device information from request headers
 */
async function getDeviceInfo() {
	const headersList = await headers()
	return {
		userAgent: headersList.get('user-agent') ?? 'unknown',
		ipAddress: headersList.get('x-forwarded-for') ?? 'unknown'
	}
}

/**
 * Logs a failed login attempt for a user.
 * Creates an activity log entry with device information.
 *
 * @param params - Object containing userId and optional error message
 */
export async function logFailedAttempt({
	userId,
	error
}: LogFailedAttemptProps): Promise<void> {
	try {
		const deviceInfo = await getDeviceInfo()

		const details: ActivityLogDetails = {
			message: 'Login attempt failed',
			error: error || 'Invalid credentials',
			metadata: {
				attemptedAt: new Date().toString()
			}
		}

		await db.insert(activityLogs).values({
			userId,
			type: 'login_failed' as ActivityType,
			status: 'error',
			ipAddress: deviceInfo.ipAddress,
			userAgent: deviceInfo.userAgent,
			details
		})
	} catch (error) {
		console.error('Failed to log login attempt:', error)
		throw new Error('Failed to log login attempt')
	}
}

export default logFailedAttempt
