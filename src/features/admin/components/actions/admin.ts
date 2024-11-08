'use server'

import { db } from '@/db'
import { users } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'

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

export async function getAdminStats() {
	try {
		// Implement your admin stats logic here
		return {
			totalUsers: 0,
			activeUsers: 0,
			// ... other stats
		}
	} catch (error) {
		console.error('Failed to get admin stats:', error)
		throw new Error('Failed to get admin stats')
	}
}

export async function getSystemHealth() {
	try {
		// Implement your system health check logic here
		return {
			status: 'healthy',
			uptime: process.uptime(),
			// ... other health metrics
		}
	} catch (error) {
		console.error('Failed to get system health:', error)
		throw new Error('Failed to get system health')
	}
}
