import { UUID, asUUID } from '@/shared/types/common';
import { db } from 'db';
import { and, count, desc, eq, gt, inArray, isNull, sql } from 'drizzle-orm';
import { notifications, notificationPreferences, users } from 'schema';
import {
	TCreateNotificationInput,
	TGetNotificationsOptions,
	TNotification,
	TNotificationPreferences,
	TNotificationPreferencesInput,
	TNotificationStats,
	TNotificationWithActor,
} from '../../types';

export function notificationRepository() {
	return {
		async create(data: TCreateNotificationInput): Promise<TNotification> {
			const [notification] = await db
				.insert(notifications)
				.values({
					userId: data.userId,
					type: data.type,
					title: data.title,
					message: data.message,
					priority: data.priority || 'medium',
					actionUrl: data.actionUrl,
					actionLabel: data.actionLabel,
					metadata: data.metadata ? JSON.stringify(data.metadata) : null,
					actorId: data.actorId,
					expiresAt: data.expiresAt,
					read: false,
					archived: false,
				})
				.returning();

			return {
				...notification,
				id: asUUID(notification.id),
				userId: asUUID(notification.userId),
				actorId: notification.actorId ? asUUID(notification.actorId) : undefined,
				metadata: notification.metadata
					? typeof notification.metadata === 'string'
						? JSON.parse(notification.metadata)
						: notification.metadata
					: undefined,
			};
		},

		async findByUserId(
			userId: UUID,
			options: TGetNotificationsOptions = {}
		): Promise<TNotificationWithActor[]> {
			const query = db
				.select({
					notification: notifications,
					actor: {
						id: users.id,
						name: users.name,
						email: users.email,
						avatar: users.avatar,
					},
				})
				.from(notifications)
				.leftJoin(users, eq(notifications.actorId, users.id))
				.where(
					and(
						eq(notifications.userId, userId),
						options.unreadOnly ? eq(notifications.read, false) : undefined,
						options.includeArchived ? undefined : eq(notifications.archived, false),
						options.types?.length
							? inArray(notifications.type, options.types)
							: undefined,
						isNull(notifications.expiresAt).or(gt(notifications.expiresAt, new Date()))
					)
				)
				.orderBy(desc(notifications.createdAt))
				.limit(options.limit || 50)
				.offset(options.offset || 0);

			const results = await query;

			return results.map(({ notification, actor }) => ({
				...notification,
				id: asUUID(notification.id),
				userId: asUUID(notification.userId),
				actorId: notification.actorId ? asUUID(notification.actorId) : undefined,
				metadata: notification.metadata
					? typeof notification.metadata === 'string'
						? JSON.parse(notification.metadata)
						: notification.metadata
					: undefined,
				actor: actor.id
					? {
							id: asUUID(actor.id),
							name: actor.name || '',
							email: actor.email,
							avatar: actor.avatar || undefined,
					  }
					: undefined,
			}));
		},

		async markAsRead(notificationIds: UUID[]): Promise<void> {
			await db
				.update(notifications)
				.set({ read: true, updatedAt: new Date() })
				.where(inArray(notifications.id, notificationIds as string[]));
		},

		async markAllAsRead(userId: UUID): Promise<void> {
			await db
				.update(notifications)
				.set({ read: true, updatedAt: new Date() })
				.where(and(eq(notifications.userId, userId), eq(notifications.read, false)));
		},

		async archive(notificationIds: UUID[]): Promise<void> {
			await db
				.update(notifications)
				.set({ archived: true, updatedAt: new Date() })
				.where(inArray(notifications.id, notificationIds as string[]));
		},

		async getStats(userId: UUID): Promise<TNotificationStats> {
			const result = await db
				.select({
					total: count(),
					unread: count(sql`CASE WHEN ${notifications.read} = false THEN 1 END`),
					highPriority: count(
						sql`CASE WHEN ${notifications.priority} IN ('high', 'urgent') AND ${notifications.read} = false THEN 1 END`
					),
				})
				.from(notifications)
				.where(
					and(
						eq(notifications.userId, userId),
						eq(notifications.archived, false),
						isNull(notifications.expiresAt).or(gt(notifications.expiresAt, new Date()))
					)
				);

			return result[0];
		},

		async savePreferences(
			userId: UUID,
			preferences: TNotificationPreferencesInput
		): Promise<TNotificationPreferences> {
			// First try to update existing preferences
			const existing = await db
				.select()
				.from(notificationPreferences)
				.where(eq(notificationPreferences.userId, userId))
				.limit(1);

			if (existing.length > 0) {
				// Update existing preferences
				const [updated] = await db
					.update(notificationPreferences)
					.set({
						...preferences,
						updatedAt: new Date(),
					})
					.where(eq(notificationPreferences.userId, userId))
					.returning();

				return {
					...updated,
					id: asUUID(updated.id),
					userId: asUUID(updated.userId),
				};
			} else {
				// Create new preferences
				const [created] = await db
					.insert(notificationPreferences)
					.values({
						userId,
						...preferences,
					})
					.returning();

				return {
					...created,
					id: asUUID(created.id),
					userId: asUUID(created.userId),
				};
			}
		},

		async getPreferences(userId: UUID): Promise<TNotificationPreferences | null> {
			const result = await db
				.select()
				.from(notificationPreferences)
				.where(eq(notificationPreferences.userId, userId))
				.limit(1);

			if (result.length === 0) {
				return null;
			}

			const preferences = result[0];
			return {
				...preferences,
				id: asUUID(preferences.id),
				userId: asUUID(preferences.userId),
			};
		},

		async getOrCreatePreferences(userId: UUID): Promise<TNotificationPreferences> {
			const existing = await this.getPreferences(userId);

			if (existing) {
				return existing;
			}

			// Create default preferences
			const [created] = await db
				.insert(notificationPreferences)
				.values({
					userId,
					taskUpdates: true,
					projectUpdates: true,
					teamMessages: true,
					securityAlerts: true,
					workspaceInvites: true,
					mentions: true,
					comments: true,
					fileShares: true,
					systemNotifications: true,
					emailNotifications: false,
					pushNotifications: true,
				})
				.returning();

			return {
				...created,
				id: asUUID(created.id),
				userId: asUUID(created.userId),
			};
		},
	};
}
