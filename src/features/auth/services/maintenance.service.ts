/**
 * @author Remco Stoeten
 * @description Provides maintenance operations for the application.
 */

import { db } from '@/db'
import { sessions } from '@/db/schema'
import { eq } from 'drizzle-orm'

export class MaintenanceService {
	static async cleanupExpiredSessions(): Promise<void> {
		await db
			.delete(sessions)
			.where(eq(sessions.expiresAt, new Date().toISOString()))
	}
}
