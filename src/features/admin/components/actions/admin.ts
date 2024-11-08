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
