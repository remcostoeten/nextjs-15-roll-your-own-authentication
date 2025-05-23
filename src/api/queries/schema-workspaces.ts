import { relations } from 'drizzle-orm';
import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { users } from '../schema';

// Workspaces table
export const workspaces = pgTable('workspaces', {
	id: uuid('id').primaryKey().defaultRandom(),
	name: text('name').notNull(),
	slug: text('slug').notNull().unique(),
	description: text('description'),
	createdBy: uuid('created_by')
		.notNull()
		.references(() => users.id),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at'),
});

// Workspace members table
export const workspaceMembers = pgTable('workspace_members', {
	id: uuid('id').primaryKey().defaultRandom(),
	workspaceId: uuid('workspace_id')
		.notNull()
		.references(() => workspaces.id, { onDelete: 'cascade' }),
	userId: uuid('user_id')
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' }),
	role: text('role').notNull().default('member'), // 'owner', 'admin', 'member'
	createdAt: timestamp('created_at').defaultNow().notNull(),
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
