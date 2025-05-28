import { users } from '@/api/db/schema';
import { relations } from 'drizzle-orm';
import { boolean, jsonb, pgEnum, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

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
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  type: notificationTypeEnum('type').notNull(),
  title: text('title').notNull(),
  message: text('message').notNull(),
  read: boolean('read').notNull().default(false),
  archived: boolean('archived').notNull().default(false),
  priority: notificationPriorityEnum('priority').notNull().default('medium'),
  actionUrl: text('action_url'),
  actionLabel: text('action_label'),
  metadata: jsonb('metadata'),
  actorId: uuid('actor_id').references(() => users.id),
  expiresAt: timestamp('expires_at'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(users, {
    fields: [notifications.userId],
    references: [users.id],
  }),
  actor: one(users, {
    fields: [notifications.actorId],
    references: [users.id],
  }),
}));
