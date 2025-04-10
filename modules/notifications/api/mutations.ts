'use server'

import { db } from '@/server/db'
import { notifications, userNotifications } from '@/server/db/schema'
import { eq, and, sql } from 'drizzle-orm'
import {
	getCurrentUser,
	requireAdmin,
	logUserActivity,
} from '@/modules/authentication/utilities/auth'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

// Create notification schema
const createNotificationSchema = z.object({
	title: z.string().min(1, 'Title is required').max(255),
	content: z.string().min(1, 'Content is required'),
	type: z.enum(['info', 'success', 'warning', 'error']).default('info'),
	expiresAt: z.string().optional(),
	link: z.string().optional(),
	isGlobal: z.boolean().default(false),
	targetUserIds: z.array(z.number()).optional(),
})

// Create notification
export async function createNotification(formData: FormData) {
	const user = await requireAdmin()

	try {
		// Parse form data
		const rawData = {
			title: formData.get('title'),
			content: formData.get('content'),
			type: formData.get('type') || 'info',
			expiresAt: formData.get('expiresAt') || undefined,
			link: formData.get('link') || undefined,
			isGlobal: formData.get('isGlobal') === 'true',
			targetUserIds: formData
				.getAll('targetUserIds')
				.map((id) => Number(id)),
		}

		const validatedData = createNotificationSchema.parse(rawData)

		// Create notification
		const [newNotification] = await db
			.insert(notifications)
			.values({
				title: validatedData.title,
				content: validatedData.content,
				type: validatedData.type,
				expiresAt: validatedData.expiresAt
					? new Date(validatedData.expiresAt)
					: null,
				link: validatedData.link || null,
				isGlobal: validatedData.isGlobal,
				createdById: user.id,
				createdAt: new Date(),
			})
			.returning()

		// If not global, create user notifications for targeted users
		if (!validatedData.isGlobal && validatedData.targetUserIds?.length) {
			const userNotificationsData = validatedData.targetUserIds.map(
				(userId) => ({
					id: crypto.randomUUID(), // Add the required id field
					userId,
					notificationId: newNotification.id,
					isRead: false,
					createdAt: new Date(),
				})
			)

			await db.insert(userNotifications).values(userNotificationsData)
		}

		// Log activity
		await logUserActivity(
			user.id,
			'create_notification',
			`Created ${validatedData.isGlobal ? 'global' : 'targeted'} notification: ${validatedData.title}`
		)

		revalidatePath('/admin/notifications')
		revalidatePath('/notifications')

		return { success: true, notificationId: newNotification.id }
	} catch (error) {
		if (error instanceof z.ZodError) {
			return { error: error.errors[0].message }
		}
		console.error('Create notification error:', error)
		return { error: 'Failed to create notification' }
	}
}

// Mark notification as read
export async function markNotificationAsRead(notificationId: number) {
	const user = await getCurrentUser()

	if (!user) {
		return { error: 'Not authenticated' }
	}

	try {
		// Check if user notification exists
		const existingUserNotification = await db
			.select()
			.from(userNotifications)
			.where(
				and(
					eq(userNotifications.userId, user.id),
					eq(userNotifications.notificationId, notificationId)
				)
			)
			.limit(1)

		if (existingUserNotification.length > 0) {
			// Update existing user notification
			await db
				.update(userNotifications)
				.set({
					isRead: true,
					readAt: new Date(),
				})
				.where(
					and(
						eq(userNotifications.userId, user.id),
						eq(userNotifications.notificationId, notificationId)
					)
				)
		} else {
			// Check if notification exists and is global
			const [notification] = await db
				.select()
				.from(notifications)
				.where(eq(notifications.id, notificationId))
				.limit(1)

			if (notification && notification.isGlobal) {
				// Create user notification for global notification
				await db.insert(userNotifications).values({
					id: crypto.randomUUID(), // Add the required id field
					userId: user.id,
					notificationId,
					isRead: true,
					readAt: new Date(),
					createdAt: new Date(),
				})
			} else {
				return { error: 'Notification not found' }
			}
		}

		revalidatePath('/notifications')
		return { success: true }
	} catch (error) {
		console.error('Mark notification as read error:', error)
		return { error: 'Failed to mark notification as read' }
	}
}

// Mark all notifications as read
export async function markAllNotificationsAsRead() {
	const user = await getCurrentUser()

	if (!user) {
		return { error: 'Not authenticated' }
	}

	try {
		// Update all existing user notifications
		await db
			.update(userNotifications)
			.set({
				isRead: true,
				readAt: new Date(),
			})
			.where(
				and(
					eq(userNotifications.userId, user.id),
					eq(userNotifications.isRead, false)
				)
			)

		// Get all global notifications that don't have a user notification entry
		const globalNotifications = await db
			.select()
			.from(notifications)
			.where(
				and(
					eq(notifications.isGlobal, true),
					sql`NOT EXISTS (
            SELECT 1 FROM ${userNotifications} 
            WHERE ${userNotifications.notificationId} = ${notifications.id} 
            AND ${userNotifications.userId} = ${user.id}
          )`
				)
			)

		// Create user notification entries for global notifications
		if (globalNotifications.length > 0) {
			const userNotificationsData = globalNotifications.map(
				(notification) => ({
					id: crypto.randomUUID(), // Add the required id field
					userId: user.id,
					notificationId: notification.id,
					isRead: true,
					readAt: new Date(),
					createdAt: new Date(),
				})
			)

			await db.insert(userNotifications).values(userNotificationsData)
		}

		revalidatePath('/notifications')
		return { success: true }
	} catch (error) {
		console.error('Mark all notifications as read error:', error)
		return { error: 'Failed to mark all notifications as read' }
	}
}

// Delete notification (admin only)
export async function deleteNotification(notificationId: number) {
	const user = await requireAdmin()

	try {
		// Get notification details for logging
		const [notification] = await db
			.select()
			.from(notifications)
			.where(eq(notifications.id, notificationId))
			.limit(1)

		if (!notification) {
			return { error: 'Notification not found' }
		}

		// Delete notification (cascade will delete user notifications)
		await db
			.delete(notifications)
			.where(eq(notifications.id, notificationId))

		// Log activity
		await logUserActivity(
			user.id,
			'delete_notification',
			`Deleted notification: ${notification.title}`
		)

		revalidatePath('/admin/notifications')
		revalidatePath('/notifications')

		return { success: true }
	} catch (error) {
		console.error('Delete notification error:', error)
		return { error: 'Failed to delete notification' }
	}
}
