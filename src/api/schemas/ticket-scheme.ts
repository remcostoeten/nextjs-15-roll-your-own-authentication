import { relations } from 'drizzle-orm';
import { integer, jsonb, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { users, workspaces } from '../schema';

// Ticket status enum
export const TicketStatus = {
	BACKLOG: 'backlog',
	TODO: 'todo',
	IN_PROGRESS: 'in_progress',
	IN_REVIEW: 'in_review',
	DONE: 'done',
	CANCELED: 'canceled',
} as const;

export type TTicketStatus = (typeof TicketStatus)[keyof typeof TicketStatus];

// Ticket priority enum
export const TicketPriority = {
	LOW: 'low',
	MEDIUM: 'medium',
	HIGH: 'high',
	URGENT: 'urgent',
} as const;

export type TTicketPriority = (typeof TicketPriority)[keyof typeof TicketPriority];

// Tickets table
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

// Ticket comments
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

// Ticket history for audit trail
export const ticketHistory = pgTable('ticket_history', {
	id: uuid('id').primaryKey().defaultRandom(),
	ticketId: uuid('ticket_id')
		.notNull()
		.references(() => tickets.id, { onDelete: 'cascade' }),
	userId: uuid('user_id')
		.notNull()
		.references(() => users.id),
	field: text('field').notNull(), // Which field was changed
	oldValue: text('old_value'),
	newValue: text('new_value'),
	createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Ticket relationships (parent-child, blocking, etc.)
export const ticketRelationships = pgTable('ticket_relationships', {
	id: uuid('id').primaryKey().defaultRandom(),
	sourceTicketId: uuid('source_ticket_id')
		.notNull()
		.references(() => tickets.id, { onDelete: 'cascade' }),
	targetTicketId: uuid('target_ticket_id')
		.notNull()
		.references(() => tickets.id, { onDelete: 'cascade' }),
	type: text('type', {
		enum: [
			'blocks',
			'is_blocked_by',
			'relates_to',
			'duplicates',
			'is_duplicated_by',
			'parent_of',
			'child_of',
		],
	}).notNull(),
	createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Define relations
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
	sourceRelationships: many(ticketRelationships, { relationName: 'sourceTicket' }),
	targetRelationships: many(ticketRelationships, { relationName: 'targetTicket' }),
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
		relationName: 'sourceTicket',
	}),
	targetTicket: one(tickets, {
		fields: [ticketRelationships.targetTicketId],
		references: [tickets.id],
		relationName: 'targetTicket',
	}),
}));
