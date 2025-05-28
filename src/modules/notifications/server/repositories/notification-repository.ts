import { UUID, asUUID } from '@/shared/types/common';
import { db } from 'db';
import { and, count, desc, eq, gt, inArray, isNull, sql } from 'drizzle-orm';
import { notifications, users } from 'schema';
import { TCreateNotificationInput, TGetNotificationsOptions, TNotification, TNotificationStats, TNotificationWithActor } from '../../types';

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
        metadata: notification.metadata ? JSON.parse(notification.metadata as string) : undefined,
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
            options.types?.length ? inArray(notifications.type, options.types) : undefined,
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
        metadata: notification.metadata ? JSON.parse(notification.metadata as string) : undefined,
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
  };
}
