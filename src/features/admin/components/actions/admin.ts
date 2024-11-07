'use server'

import { db } from '@/db'
import { users } from '@/db/schema'
import { isAdmin } from '@/shared/utilities/get-admin'
import { eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { AdminDashboardStats, SystemHealth } from '../types'

/**
 * Retrieves admin dashboard statistics
 * @returns {Promise<AdminDashboardStats>} Dashboard statistics
 * @throws {Error} If user is not admin or if fetching fails
 */
export async function getAdminStats(): Promise<AdminDashboardStats> {
	const adminStatus = await isAdmin()
	if (!adminStatus) throw new Error('Unauthorized')

	try {
		const [totalUsers] = await db
			.select({ count: sql`count(*)` })
			.from(users)

		// Add more stat calculations here

		return {
			totalUsers: totalUsers.count,
			activeUsers: 0, // Implement active user counting
			newUsersToday: 0, // Implement new user counting
			totalPageViews: 0 // Get from analytics
		}
	} catch (error) {
		console.error('Failed to fetch admin stats:', error)
		throw new Error('Failed to fetch admin stats')
	}
}

/**
 * Changes a user's role
 * @param {string} userId - The ID of the user to update
 * @param {'admin' | 'user'} newRole - The new role to assign
 * @throws {Error} If user is not admin or if update fails
 */
export async function changeUserRole(
	userId: string,
	newRole: 'admin' | 'user'
) {
	const adminStatus = await isAdmin()
	if (!adminStatus) throw new Error('Unauthorized')

	try {
		await db
			.update(users)
			.set({ role: newRole })
			.where(eq(users.id, userId))

		revalidatePath('/dashboard/admin/users')
	} catch (error) {
		console.error('Failed to change user role:', error)
		throw new Error('Failed to change user role')
	}
}

/**
 * Gets system health metrics
 * @returns {Promise<SystemHealth>} System health information
 * @throws {Error} If user is not admin or if fetching fails
 */
export async function getSystemHealth(): Promise<SystemHealth> {
	const adminStatus = await isAdmin()
	if (!adminStatus) throw new Error('Unauthorized')

	try {
		// Implement actual health checks here
		return {
			databaseStatus: 'healthy',
			apiStatus: 'operational',
			lastBackup: new Date().toISOString(),
			activeConnections: 0,
			serverLoad: 0
		}
	} catch (error) {
		console.error('Failed to get system health:', error)
		throw new Error('Failed to get system health')
	}
}
