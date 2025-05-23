import { relations } from 'drizzle-orm';
import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { users } from '../schema';

// === workspace_activities ===
export const workspaceActivities = pgTable('workspace_activities', {
	id: uuid('id').primaryKey().defaultRandom(),
	workspaceId: uuid('workspace_id')
		.notNull()
		.references(() => workspaces.id, { onDelete: 'cascade' }),
	userId: uuid('user_id')
		.notNull()
		.references(() => users.id),
	type: text('type').notNull(),
	targetUserId: uuid('target_user_id').references(() => users.id),
	metadata: text('metadata'),
	createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

// === workspace_members ===
export const workspaceMembers = pgTable('workspace_members', {
	id: uuid('id').primaryKey().defaultRandom(),
	workspaceId: uuid('workspace_id')
		.notNull()
		.references(() => workspaces.id, { onDelete: 'cascade' }),
	userId: uuid('user_id')
		.notNull()
		.references(() => users.id),
	role: text('role').notNull(),
	joinedAt: timestamp('joined_at', { withTimezone: true }).defaultNow().notNull(),
});

// === workspaces ===
export const workspaces = pgTable('workspaces', {
	id: uuid('id').primaryKey().defaultRandom(),
	title: text('title').notNull(),
	emoji: text('emoji'),
	description: text('description'),
	createdBy: uuid('created_by')
		.notNull()
		.references(() => users.id),
	createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
	updatedAt: timestamp('updated_at', { withTimezone: true }),
});

// Define relations
export const workspacesRelations = relations(workspaces, ({ one, many }) => ({
	creator: one(users, {
		fields: [workspaces.createdBy],
		references: [users.id],
	}),
	members: many(workspaceMembers),
}));

export const workspaceMembersRelations = relations(workspaceMembers, ({ one }) => ({
	workspace: one(workspaces, {
		fields: [workspaceMembers.workspaceId],
		references: [workspaces.id],
	}),
	user: one(users, {
		fields: [workspaceMembers.userId],
		references: [users.id],
	}),
}));
