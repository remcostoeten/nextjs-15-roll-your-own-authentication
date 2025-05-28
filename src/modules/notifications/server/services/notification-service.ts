import { db } from '@/api/db';
import { notifications, notificationPreferences, users } from '@/api/db/schema';
import { eq, and, desc, count, sql, inArray } from 'drizzle-orm';
import { 
  TCreateNotificationInput, 
  TNotificationWithActor, 
  TNotificationStats,
  TNotificationPreferences,
  TNotificationType 
} from '../../types';

export class NotificationService {
  static async createNotification(input: TCreateNotificationInput): Promise<TNotificationWithActor> {
    const [notification] = await db
      .insert(notifications)
      .values({
        userId: input.userId,
        actorId: input.actorId,
        type: input.type,
        title: input.title,
        message: input.message,
        priority: input.priority || 'medium',
        actionUrl: input.actionUrl,
        actionLabel: input.actionLabel,
        metadata: input.metadata,
        expiresAt: input.expiresAt,
      })
      .returning();

    return this.getNotificationWithActor(notification.id);
  }

  static async getNotificationWithActor(notificationId: string): Promise<TNotificationWithActor> {
    const [result] = await db
      .select({
        id: notifications.id,
        userId: notifications.userId,
        actorId: notifications.actorId,
        type: notifications.type,
        title: notifications.title,
        message: notifications.message,
        priority: notifications.priority,
        isRead: notifications.isRead,
        isArchived: notifications.isArchived,
        actionUrl: notifications.actionUrl,
        actionLabel: notifications.actionLabel,
        metadata: notifications.metadata,
        expiresAt: notifications.expiresAt,
        createdAt: notifications.createdAt,
        updatedAt: notifications.updatedAt,
        actor: {
          id: users.id,
          name: users.name,
          email: users.email,
          avatar: users.avatar,
        },
      })
      .from(notifications)
      .leftJoin(users, eq(notifications.actorId, users.id))
      .where(eq(notifications.id, notificationId));

    return result;
  }

  static async getUserNotifications(
    userId: string,
    options: {
      limit?: number;
      offset?: number;
      unreadOnly?: boolean;
      types?: TNotificationType[];
      includeArchived?: boolean;
    } = {}
  ): Promise<TNotificationWithActor[]> {
    const {
      limit = 50,
      offset = 0,
      unreadOnly = false,
      types,
      includeArchived = false,
    } = options;

    let query = db
      .select({
        id: notifications.id,
        userId: notifications.userId,
        actorId: notifications.actorId,
        type: notifications.type,
        title: notifications.title,
        message: notifications.message,
        priority: notifications.priority,
        isRead: notifications.isRead,
        isArchived: notifications.isArchived,
        actionUrl: notifications.actionUrl,
        actionLabel: notifications.actionLabel,
        metadata: notifications.metadata,
        expiresAt: notifications.expiresAt,
        createdAt: notifications.createdAt,
        updatedAt: notifications.updatedAt,
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
          unreadOnly ? eq(notifications.isRead, false) : undefined,
          !includeArchived ? eq(notifications.isArchived, false) : undefined,
          types ? inArray(notifications.type, types) : undefined,
          sql`(${notifications.expiresAt} IS NULL OR ${notifications.expiresAt} > NOW())`
        )
      )
      .orderBy(desc(notifications.createdAt))
      .limit(limit)
      .offset(offset);

    return await query;
  }

  static async getNotificationStats(userId: string): Promise<TNotificationStats> {
    const stats = await db
      .select({
        total: count(),
        unread: sql<number>`COUNT(CASE WHEN ${notifications.isRead} = false THEN 1 END)`,
        type: notifications.type,
        priority: notifications.priority,
      })
      .from(notifications)
      .where(
        and(
          eq(notifications.userId, userId),
          eq(notifications.isArchived, false),
          sql`(${notifications.expiresAt} IS NULL OR ${notifications.expiresAt} > NOW())`
        )
      )
      .groupBy(notifications.type, notifications.priority);

    const byType: Record<TNotificationType, number> = {} as any;
    const byPriority: Record<string, number> = {};
    let total = 0;
    let unread = 0;

    stats.forEach(stat => {
      byType[stat.type] = (byType[stat.type] || 0) + Number(stat.total);
      byPriority[stat.priority] = (byPriority[stat.priority] || 0) + Number(stat.total);
      total += Number(stat.total);
      unread += Number(stat.unread);
    });

    return {
      total,
      unread,
      byType,
      byPriority: byPriority as any,
    };
  }

  static async markAsRead(notificationIds: string[]): Promise<void> {
    await db
      .update(notifications)
      .set({ isRead: true, updatedAt: new Date() })
      .where(inArray(notifications.id, notificationIds));
  }

  static async markAllAsRead(userId: string): Promise<void> {
    await db
      .update(notifications)
      .set({ isRead: true, updatedAt: new Date() })
      .where(and(
        eq(notifications.userId, userId),
        eq(notifications.isRead, false)
      ));
  }

  static async archiveNotifications(notificationIds: string[]): Promise<void> {
    await db
      .update(notifications)
      .set({ isArchived: true, updatedAt: new Date() })
      .where(inArray(notifications.id, notificationIds));
  }

  static async deleteNotifications(notificationIds: string[]): Promise<void> {
    await db
      .delete(notifications)
      .where(inArray(notifications.id, notificationIds));
  }

  static async getUserPreferences(userId: string): Promise<TNotificationPreferences | null> {
    const [prefs] = await db
      .select()
      .from(notificationPreferences)
      .where(eq(notificationPreferences.userId, userId));

    return prefs || null;
  }

  static async updateUserPreferences(
    userId: string,
    preferences: Partial<TNotificationPreferences>
  ): Promise<TNotificationPreferences> {
    const [updated] = await db
      .insert(notificationPreferences)
      .values({
        userId,
        ...preferences,
        updatedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: notificationPreferences.userId,
        set: {
          ...preferences,
          updatedAt: new Date(),
        },
      })
      .returning();

    return updated;
  }
}
