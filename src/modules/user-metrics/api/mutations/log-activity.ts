'use server'

import { db } from '@/server/db'
import { activityLogs, users } from '@/server/db/schemas'
import { z } from 'zod'
import { eq } from 'drizzle-orm'

const logActivitySchema = z.object({
	userId: z.string(),
	action: z.string(),
	details: z.string().optional(),
})

export const logActivity = async (data: z.infer<typeof logActivitySchema>) => {
	try {
		console.log('[logActivity] Function called with data:', JSON.stringify(data))

		// Validate the input data
		const { userId, action, details } = logActivitySchema.parse(data)
		console.log('[logActivity] Validation passed')

		// Check if userId exists in the users table
		const userExists = await db.query.users.findFirst({
			where: eq(users.id, userId),
		})

		if (!userExists) {
			console.error(`[logActivity] Error: User with ID ${userId} not found in database`)
			throw new Error(`User with ID ${userId} not found`)
		}

		console.log('[logActivity] User exists, attempting to insert activity log')

		// Insert activity log
		const result = await db
			.insert(activityLogs)
			.values({
				userId,
				action,
				details,
			})
			.returning()

		console.log('[logActivity] Successfully inserted activity log:', JSON.stringify(result[0]))
		return result[0]
	} catch (error) {
		console.error('[logActivity] Failed to log activity:', error)
		// Don't throw the error to prevent blocking the parent function (like login)
		// This way, if activity logging fails, it won't prevent user login
		return null
	}
}
