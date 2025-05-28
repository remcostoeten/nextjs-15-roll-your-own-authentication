import { pgTable, text, boolean, timestamp, jsonb, pgEnum, uuid, index } from 'drizzle-orm/pg-core';
import { users } from '@/modules/authenticatie/schemas';

export const notificationTypeEnum = pgEnum('notification_type', [
  'workspace_invite',
  'member_joined',
  'member_left',
  'project_created',
  'project_updated',
  'task_assigned',
  'task_completed',
  'mention',
  'comment',
  'file_shared',
  'system'
]);

export const notificationPriorityEnum = pgEnum('notification_priority', [
  'low',
  'medium',
  'high',
  'urgent'
]);

export const notifications = pgTable('notifications', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  actorId: uuid('actor_id').references(() => users.id, { onDelete: 'set null' }),
  type: notificationTypeEnum('type').notNull(),
  title: text('title').notNull(),
  message: text('message').notNull(),
  priority: notificationPriorityEnum('priority').notNull().default('medium'),
  isRead: boolean('is_read').notNull().default(false),
  isArchived: boolean('is_archived').notNull().default(false),
  actionUrl: text('action_url'),
  actionLabel: text('action_label'),
  metadata: jsonb('metadata'),
  expiresAt: timestamp('expires_at'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
}, (table) => ({
  userIdIdx: index('notifications_user_id_idx').on(table.userId),
  typeIdx: index('notifications_type_idx').on(table.type),
  isReadIdx: index('notifications_is_read_idx').on(table.isRead),
  createdAtIdx: index('notifications_created_at_idx').on(table.createdAt),
  userReadIdx: index('notifications_user_read_idx').on(table.userId, table.isRead),
}));

export const notificationPreferences = pgTable('notification_preferences', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }).unique(),
  emailNotifications: boolean('email_notifications').notNull().default(true),
  pushNotifications: boolean('push_notifications').notNull().default(true),
  inAppNotifications: boolean('in_app_notifications').notNull().default(true),
  notificationTypes: jsonb('notification_types').notNull().default({}),
  quietHours: jsonb('quiet_hours').notNull().default({
    enabled: false,
    startTime: '22:00',
    endTime: '08:00'
  }),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
}, (table) => ({
  userIdIdx: index('notification_preferences_user_id_idx').on(table.userId),
}));
