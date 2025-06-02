// @ts-nocheck
import { relations } from 'drizzle-orm';
import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { users } from 'schema';
import { projects } from '@/modules/projects/server/schemas/schema-projects';

// Tasks table
export const tasks = pgTable('tasks', {
	id: uuid('id').primaryKey().defaultRandom(),
	projectId: uuid('project_id')
		.notNull()
		.references(() => projects.id, { onDelete: 'cascade' }),
	title: text('title').notNull(),
	description: text('description'),
	status: text('status', {
		enum: ['todo', 'in_progress', 'done', 'cancelled'],
	})
		.notNull()
		.default('todo'),
	priority: text('priority', {
		enum: ['low', 'medium', 'high', 'urgent'],
	})
		.notNull()
		.default('medium'),
	assigneeId: uuid('assignee_id').references(() => users.id),
	createdBy: uuid('created_by')
		.notNull()
		.references(() => users.id),
	dueDate: timestamp('due_date'),
	completedAt: timestamp('completed_at'),
	createdAt: timestamp('created_at').notNull().defaultNow(),
	updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Define relations
export const tasksRelations = relations(tasks, ({ one }) => ({
	project: one(projects, {
		fields: [tasks.projectId],
		references: [projects.id],
	}),
	assignee: one(users, {
		fields: [tasks.assigneeId],
		references: [users.id],
	}),
	creator: one(users, {
		fields: [tasks.createdBy],
		references: [users.id],
	}),
}));
