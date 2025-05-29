import { relations } from 'drizzle-orm';
import { boolean, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { users } from 'schema';

// Workspaces table
export const workspaces = pgTable('workspaces', {
	id: uuid('id').primaryKey().defaultRandom(),
	title: text('title').notNull(),
	emoji: text('emoji').notNull().default('🏢'),
	description: text('description'),
	ownerId: uuid('owner_id')
		.notNull()
		.references(() => users.id),
	isPersonal: boolean('is_personal').notNull().default(false),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at').defaultNow(),
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
	role: text('role').notNull().default('member'), // 'owner', 'admin', 'member', 'viewer'
	invitedBy: uuid('invited_by').references(() => users.id),
	joinedAt: timestamp('joined_at').defaultNow().notNull(),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at').defaultNow(),
});

// Workspace invites table
export const workspaceInvites = pgTable('workspace_invites', {
	id: uuid('id').primaryKey().defaultRandom(),
	workspaceId: uuid('workspace_id')
		.notNull()
		.references(() => workspaces.id, { onDelete: 'cascade' }),
	email: text('email').notNull(),
	role: text('role').notNull().default('member'),
	invitedBy: uuid('invited_by')
		.notNull()
		.references(() => users.id),
	token: text('token').notNull().unique(),
	expiresAt: timestamp('expires_at').notNull(),
	acceptedAt: timestamp('accepted_at'),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at').defaultNow(),
});

// Define relations
export const workspacesRelations = relations(workspaces, ({ one, many }) => ({
	owner: one(users, {
		fields: [workspaces.ownerId],
		references: [users.id],
	}),
	members: many(workspaceMembers),
	invites: many(workspaceInvites),
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
	inviter: one(users, {
		fields: [workspaceMembers.invitedBy],
		references: [users.id],
	}),
}));

export const workspaceInvitesRelations = relations(workspaceInvites, ({ one }) => ({
	workspace: one(workspaces, {
		fields: [workspaceInvites.workspaceId],
		references: [workspaces.id],
	}),
	inviter: one(users, {
		fields: [workspaceInvites.invitedBy],
		references: [users.id],
	}),
}));
