// @ts-nocheck

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
	'system',
]);

export const notificationPriorityEnum = pgEnum('notification_priority', [
	'low',
	'medium',
	'high',
	'urgent',
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

// User notification preferences table
export const notificationPreferences = pgTable('notification_preferences', {
	id: uuid('id').primaryKey().defaultRandom(),
	userId: uuid('user_id')
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' })
		.unique(),
	taskUpdates: boolean('task_updates').notNull().default(true),
	projectUpdates: boolean('project_updates').notNull().default(true),
	teamMessages: boolean('team_messages').notNull().default(true),
	securityAlerts: boolean('security_alerts').notNull().default(true),
	workspaceInvites: boolean('workspace_invites').notNull().default(true),
	mentions: boolean('mentions').notNull().default(true),
	comments: boolean('comments').notNull().default(true),
	fileShares: boolean('file_shares').notNull().default(true),
	systemNotifications: boolean('system_notifications').notNull().default(true),
	emailNotifications: boolean('email_notifications').notNull().default(false),
	pushNotifications: boolean('push_notifications').notNull().default(true),
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

export const notificationPreferencesRelations = relations(notificationPreferences, ({ one }) => ({
	user: one(users, {
		fields: [notificationPreferences.userId],
		references: [users.id],
	}),
}));
