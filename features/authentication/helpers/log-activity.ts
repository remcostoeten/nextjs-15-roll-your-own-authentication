'use server'

import { activityLogs } from '@/app/server/schema'
import { authConfig } from '@/config'
import type { ActivityType } from '@/features/authentication/activity-logs/schema'
import { db } from 'db'
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js'
import { headers } from 'next/headers'

type ActivityStatus = 'success' | 'error' | 'pending'

type ActivityLogProps = {
	userId: number
	type: ActivityType
	status?: ActivityStatus
	message: string
	error?: string
	metadata?: Record<string, unknown>
	tx?: PostgresJsDatabase
	timestamp?: string | Date
}

type DeviceInfo = {
	userAgent: string
	ipAddress: string
}

type LogRegistrationParams = {
	status: 'success' | 'failure'
	ipAddress: string
	email: string
	message: string
	timestamp?: string
}

/**
 * Gets device information from request headers
 */
async function getDeviceInfo(): Promise<DeviceInfo> {
	const headersList = await headers()
	return {
		userAgent: headersList.get('user-agent') ?? 'unknown',
		ipAddress: headersList.get('x-forwarded-for') ?? 'unknown'
	}
}

export async function logActivity({
	userId,
	type,
	status = 'success',
	message,
	error,
	metadata = {},
	tx
}: ActivityLogProps): Promise<void> {
	try {
		const deviceInfo = await getDeviceInfo()
		const timestamp = new Date().toString()

		const activityData = {
			userId,
			type,
			status,
			ipAddress: deviceInfo.ipAddress,
			userAgent: deviceInfo.userAgent,
			details: {
				message,
				error,
				metadata: {
					...metadata,
					timestamp
				}
			}
		}

		// If transaction is provided, use it; otherwise use regular db
		const dbContext = tx || db
		await dbContext.insert(activityLogs).values(activityData)
	} catch (error) {
		console.error('Failed to log activity:', error)
		throw new Error(`Failed to log ${type} activity`)
	}
}

export async function logLoginSuccess(userId: number, metadata = {}) {
	logActivity({
		userId,
		type: 'login',
		status: 'success',
		message: authConfig.MESSAGES.LOGIN_SUCCESS,
		metadata
	})
}

export async function logLoginFailure(
	userId: number,
	error: string,
	metadata = {}
) {
	logActivity({
		userId,
		type: 'login_failed',
		status: 'error',
		message: authConfig.MESSAGES.LOGIN_FAILED,
		error,
		metadata
	})
}

export async function logRegistration(userId: number, metadata = {}) {
	logActivity({
		userId,
		type: 'register',
		message: authConfig.MESSAGES.REGISTRATION_SUCCESS,
		metadata
	})
}

export async function logLogout(userId: number, metadata = {}) {
	logActivity({
		userId,
		type: 'logout',
		message: 'User logged out successfully',
		metadata
	})
}

export async function logProfileUpdate(
	userId: number,
	message: string,
	metadata = {}
) {
	logActivity({
		userId,
		type: 'profile_updated',
		message,
		metadata
	})
}
