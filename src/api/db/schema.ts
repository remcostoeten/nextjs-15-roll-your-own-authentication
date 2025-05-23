import { relations } from 'drizzle-orm';
import { integer, jsonb, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

export const UserRole = {
	ADMIN: 'admin',
	USER: 'user',
} as const;
export type TUserRole = (typeof UserRole)[keyof typeof UserRole];

export const users = pgTable('users_table', {
	id: uuid('id').primaryKey().defaultRandom(),
	email: text('email').notNull().unique(),
	password: text('password').notNull(),
	role: text('role').default('user').notNull(),
	name: text('name'),
	avatar: text('avatar'),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at'),
	lastLoginAt: timestamp('last_login_at'),
});

export const sessions = pgTable('sessions', {
	id: uuid('id').primaryKey().defaultRandom(),
	userId: uuid('user_id')
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' }),
	expiresAt: timestamp('expires_at').notNull(),
	createdAt: timestamp('created_at').defaultNow().notNull(),
});

// === Workspace-related schemas ===
export const workspaces = pgTable('workspaces', {
	id: uuid('id').primaryKey().defaultRandom(),
	title: text('title').notNull(),
	slug: text('slug').notNull(),
	emoji: text('emoji'),
	description: text('description'),
	createdBy: uuid('created_by')
		.notNull()
		.references(() => users.id),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at'),
});

export const workspaceMembers = pgTable('workspace_members', {
	id: uuid('id').primaryKey().defaultRandom(),
	workspaceId: uuid('workspace_id')
		.notNull()
		.references(() => workspaces.id, { onDelete: 'cascade' }),
	userId: uuid('user_id')
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' }),
	role: text('role').notNull().default('member'),
	createdAt: timestamp('created_at').defaultNow().notNull(),
});

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
	createdAt: timestamp('created_at').defaultNow().notNull(),
});

// === Note-related schemas ===
export const notes = pgTable('notes', {
	id: uuid('id').primaryKey().defaultRandom(),
	workspaceId: uuid('workspace_id')
		.notNull()
		.references(() => workspaces.id, { onDelete: 'cascade' }),
	title: text('title').notNull(),
	content: jsonb('content').notNull(),
	createdBy: uuid('created_by')
		.notNull()
		.references(() => users.id),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at'),
});

export const noteMentions = pgTable('note_mentions', {
	id: uuid('id').primaryKey().defaultRandom(),
	noteId: uuid('note_id')
		.notNull()
		.references(() => notes.id, { onDelete: 'cascade' }),
	mentionType: text('mention_type').notNull(),
	mentionId: uuid('mention_id').notNull(),
	createdAt: timestamp('created_at').defaultNow().notNull(),
});

// === Ticket-related schemas ===
export const TicketStatus = {
	BACKLOG: 'backlog',
	TODO: 'todo',
	IN_PROGRESS: 'in_progress',
	IN_REVIEW: 'in_review',
	DONE: 'done',
	CANCELED: 'canceled',
} as const;

export type TTicketStatus = (typeof TicketStatus)[keyof typeof TicketStatus];

export const TicketPriority = {
	LOW: 'low',
	MEDIUM: 'medium',
	HIGH: 'high',
	URGENT: 'urgent',
} as const;

export type TTicketPriority = (typeof TicketPriority)[keyof typeof TicketPriority];

export const tickets = pgTable('tickets', {
	id: uuid('id').primaryKey().defaultRandom(),
	workspaceId: uuid('workspace_id')
		.notNull()
		.references(() => workspaces.id, { onDelete: 'cascade' }),
	title: text('title').notNull(),
	description: text('description'),
	status: text('status', {
		enum: ['backlog', 'todo', 'in_progress', 'in_review', 'done', 'canceled'],
	})
		.default('backlog')
		.notNull(),
	priority: text('priority', {
		enum: ['low', 'medium', 'high', 'urgent'],
	})
		.default('medium')
		.notNull(),
	assigneeId: uuid('assignee_id').references(() => users.id),
	reporterId: uuid('reporter_id')
		.notNull()
		.references(() => users.id),
	dueDate: timestamp('due_date'),
	estimatedHours: integer('estimated_hours'),
	labels: jsonb('labels').default([]),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at'),
});

export const ticketComments = pgTable('ticket_comments', {
	id: uuid('id').primaryKey().defaultRandom(),
	ticketId: uuid('ticket_id')
		.notNull()
		.references(() => tickets.id, { onDelete: 'cascade' }),
	userId: uuid('user_id')
		.notNull()
		.references(() => users.id),
	content: text('content').notNull(),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at'),
});

export const ticketHistory = pgTable('ticket_history', {
	id: uuid('id').primaryKey().defaultRandom(),
	ticketId: uuid('ticket_id')
		.notNull()
		.references(() => tickets.id, { onDelete: 'cascade' }),
	userId: uuid('user_id')
		.notNull()
		.references(() => users.id),
	field: text('field').notNull(),
	oldValue: text('old_value'),
	newValue: text('new_value'),
	createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const ticketRelationships = pgTable('ticket_relationships', {
	id: uuid('id').primaryKey().defaultRandom(),
	sourceTicketId: uuid('source_ticket_id')
		.notNull()
		.references(() => tickets.id, { onDelete: 'cascade' }),
	targetTicketId: uuid('target_ticket_id')
		.notNull()
		.references(() => tickets.id, { onDelete: 'cascade' }),
	type: text('type').notNull(),
	createdAt: timestamp('created_at').defaultNow().notNull(),
});

// === Relations ===
export const usersRelations = relations(users, ({ many }) => ({
	sessions: many(sessions),
	workspaces: many(workspaceMembers),
	notes: many(notes),
	tickets: many(tickets),
	comments: many(ticketComments),
	history: many(ticketHistory),
	activities: many(workspaceActivities),
}));

export const workspacesRelations = relations(workspaces, ({ one, many }) => ({
	creator: one(users, {
		fields: [workspaces.createdBy],
		references: [users.id],
	}),
	members: many(workspaceMembers),
	notes: many(notes),
	tickets: many(tickets),
	activities: many(workspaceActivities),
}));

export const notesRelations = relations(notes, ({ one, many }) => ({
	workspace: one(workspaces, {
		fields: [notes.workspaceId],
		references: [workspaces.id],
	}),
	creator: one(users, {
		fields: [notes.createdBy],
		references: [users.id],
	}),
	mentions: many(noteMentions),
}));

export const ticketsRelations = relations(tickets, ({ one, many }) => ({
	workspace: one(workspaces, {
		fields: [tickets.workspaceId],
		references: [workspaces.id],
	}),
	assignee: one(users, {
		fields: [tickets.assigneeId],
		references: [users.id],
	}),
	reporter: one(users, {
		fields: [tickets.reporterId],
		references: [users.id],
	}),
	comments: many(ticketComments),
	history: many(ticketHistory),
	relationships: many(ticketRelationships, { relationName: 'sourceTickets' }),
	relatedTo: many(ticketRelationships, { relationName: 'targetTickets' }),
}));

export const ticketCommentsRelations = relations(ticketComments, ({ one }) => ({
	ticket: one(tickets, {
		fields: [ticketComments.ticketId],
		references: [tickets.id],
	}),
	user: one(users, {
		fields: [ticketComments.userId],
		references: [users.id],
	}),
}));

export const ticketHistoryRelations = relations(ticketHistory, ({ one }) => ({
	ticket: one(tickets, {
		fields: [ticketHistory.ticketId],
		references: [tickets.id],
	}),
	user: one(users, {
		fields: [ticketHistory.userId],
		references: [users.id],
	}),
}));

export const ticketRelationshipsRelations = relations(ticketRelationships, ({ one }) => ({
	sourceTicket: one(tickets, {
		fields: [ticketRelationships.sourceTicketId],
		references: [tickets.id],
		relationName: 'sourceTickets',
	}),
	targetTicket: one(tickets, {
		fields: [ticketRelationships.targetTicketId],
		references: [tickets.id],
		relationName: 'targetTickets',
	}),
}));
