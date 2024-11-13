import { authConfig } from '@/config'
import { db } from 'db'
import { activityLogs, ActivityType } from '../activity-logs/schema'

export async function logSuccessfulLogin(
	userId: number,
	ip: string,
	userAgent: string | null
) {
	await db.insert(activityLogs).values({
		userId,
		type: authConfig.ACTIVITY_TYPES.LOGIN as ActivityType,
		status: authConfig.STATUS.SUCCESS,
		ipAddress: ip,
		userAgent,
		details: {
			message: authConfig.MESSAGES.LOGIN_SUCCESS
		}
	})
}
