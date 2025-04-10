import { db } from '@/server/db'
import {
	users,
	sessions,
	oauthAccounts,
	workspaceMembers,
	tasks,
} from '@/server/db/schema'
import { eq } from 'drizzle-orm'

export async function updateUserAdminStatus(userId: string, isAdmin: boolean) {
	try {
		// Update both isAdmin and role for compatibility
		await db
			.update(users)
			.set({
				isAdmin: isAdmin,
				role: isAdmin ? 'admin' : 'user',
			})
			.where(eq(users.id, userId))

		return { success: true }
	} catch (error) {
		console.error('Error updating user admin status:', error)
		throw new Error('Failed to update user admin status')
	}
}

export async function deleteUser(userId: string) {
	try {
		// Delete user's sessions
		await db.delete(sessions).where(eq(sessions.userId, userId))

		// Delete user's OAuth accounts
		await db.delete(oauthAccounts).where(eq(oauthAccounts.userId, userId))

		// Delete user's workspace memberships
		await db
			.delete(workspaceMembers)
			.where(eq(workspaceMembers.userId, userId))

		// Update tasks assigned to this user (set assignedToId to null)
		await db
			.update(tasks)
			.set({ assignedToId: null })
			.where(eq(tasks.assignedToId, userId))

		// Finally, delete the user
		await db.delete(users).where(eq(users.id, userId))

		return { success: true }
	} catch (error) {
		console.error('Error deleting user:', error)
		throw new Error('Failed to delete user')
	}
}
