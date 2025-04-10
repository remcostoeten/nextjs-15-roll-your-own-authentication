'use server'

import { db } from '@/server/db'
import { notifications, userNotifications, users } from '@/server/db/schema'
import { eq, and, isNull, or, gte, desc, count } from 'drizzle-orm'
import { getCurrentUser } from '@/modules/authentication/utilities/auth'
import { sql } from 'drizzle-orm'

// Get user notifications
export async function getUserNotifications(limit = 10, offset = 0) {
	const user = await getCurrentUser()

	if (!user) {
		return { notifications: [], unreadCount: 0, total: 0 }
	}

	// Get notifications for this user (either targeted or global)
	const notificationsQuery = db
		.select({
			id: notifications.id,
			title: notifications.title,
			content: notifications.content,
			type: notifications.type,
			createdAt: notifications.createdAt,
			expiresAt: notifications.expiresAt,
			link: notifications.link,
			isGlobal: notifications.isGlobal,
			metadata: notifications.metadata,
			isRead: userNotifications.isRead,
			readAt: userNotifications.readAt,
			creator: {
				id: users.id,
				firstName: users.firstName,
				lastName: users.lastName,
			},
		})
		.from(notifications)
		.innerJoin(users, eq(notifications.createdById, users.id))
		.leftJoin(
			userNotifications,
			and(
				eq(userNotifications.notificationId, notifications.id),
				eq(userNotifications.userId, user.id)
			)
		)
		.where(
			and(
				or(
					eq(notifications.isGlobal, true),
					sql`EXISTS (
            SELECT 1 FROM ${userNotifications} 
            WHERE ${userNotifications.notificationId} = ${notifications.id} 
            AND ${userNotifications.userId} = ${user.id}
          )`
				),
				or(
					isNull(notifications.expiresAt),
					gte(notifications.expiresAt, new Date())
				)
			)
		)
		.orderBy(desc(notifications.createdAt))
		.limit(limit)
		.offset(offset)

	const userNotificationsResult = await notificationsQuery

	// Get unread count
	const [unreadCountResult] = await db
		.select({ count: count() })
		.from(userNotifications)
		.where(
			and(
				eq(userNotifications.userId, user.id),
				eq(userNotifications.isRead, false)
			)
		)

	// Get total count
	const [totalCountResult] = await db
		.select({ count: count() })
		.from(notifications)
		.where(
			and(
				or(
					eq(notifications.isGlobal, true),
					sql`EXISTS (
            SELECT 1 FROM ${userNotifications} 
            WHERE ${userNotifications.notificationId} = ${notifications.id} 
            AND ${userNotifications.userId} = ${user.id}
          )`
				),
				or(
					isNull(notifications.expiresAt),
					gte(notifications.expiresAt, new Date())
				)
			)
		)

	return {
		notifications: userNotificationsResult,
		unreadCount: unreadCountResult?.count || 0,
		total: totalCountResult?.count || 0,
	}
}

// Get notification by id
export async function getNotificationById(id: number) {
	const user = await getCurrentUser()

	if (!user) {
		return null
	}

	const [notification] = await db
		.select({
			id: notifications.id,
			title: notifications.title,
			content: notifications.content,
			type: notifications.type,
			createdAt: notifications.createdAt,
			expiresAt: notifications.expiresAt,
			link: notifications.link,
			isGlobal: notifications.isGlobal,
			metadata: notifications.metadata,
			isRead: userNotifications.isRead,
			readAt: userNotifications.readAt,
			creator: {
				id: users.id,
				firstName: users.firstName,
				lastName: users.lastName,
			},
		})
		.from(notifications)
		.innerJoin(users, eq(notifications.createdById, users.id))
		.leftJoin(
			userNotifications,
			and(
				eq(userNotifications.notificationId, notifications.id),
				eq(userNotifications.userId, user.id)
			)
		)
		.where(eq(notifications.id, id))

	return notification
}

// Get all users for notification targeting
export async function getUsersForNotificationTargeting() {
	const user = await getCurrentUser()

	if (!user || user.role !== 'admin') {
		return []
	}

	const allUsers = await db
		.select({
			id: users.id,
			email: users.email,
			firstName: users.firstName,
			lastName: users.lastName,
			role: users.role,
		})
		.from(users)
		.where(eq(users.isActive, true))
		.orderBy(users.firstName, users.lastName)

	return allUsers
}
