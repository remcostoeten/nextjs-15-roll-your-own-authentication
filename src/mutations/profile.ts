'use server'

import bcryptjs, { hash } from 'bcryptjs'
import { eq } from 'drizzle-orm'
import { db } from '../server/db'
import { users } from '../server/db/schema'

export async function updateProfile(formData: FormData) {
	try {
		const userId = Number(formData.get('userId'))
		const name = formData.get('name') as string
		const currentPassword = formData.get('currentPassword') as string
		const newPassword = formData.get('newPassword') as string
		const confirmPassword = formData.get('confirmPassword') as string

		// Get current user
		const [user] = await db.select().from(users).where(eq(users.id, userId))
		if (!user) {
			return { error: 'User not found' }
		}

		const updates: any = {}

		// Handle name update
		if (name && name !== user.name) {
			updates.name = name
		}

		// Handle password update
		if (currentPassword && newPassword) {
			if (newPassword !== confirmPassword) {
				return { error: 'New passwords do not match' }
			}

			const isValidPassword = await bcryptjs.compare(
				currentPassword,
				user.password
			)
			if (!isValidPassword) {
				return { error: 'Current password is incorrect' }
			}

			updates.password = await hash(newPassword, 10)
		}

		// Only update if there are changes
		if (Object.keys(updates).length > 0) {
			await db.update(users).set(updates).where(eq(users.id, userId))

			return { message: 'Profile updated successfully' }
		}

		return { message: 'No changes to update' }
	} catch (error) {
		console.error('Profile update error:', error)
		return { error: 'Failed to update profile' }
	}
}
