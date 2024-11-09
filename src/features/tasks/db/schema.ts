import { createId } from '@paralleldrive/cuid2'
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const tasks = sqliteTable('tasks', {
	id: text('id')
		.$defaultFn(() => createId())
		.primaryKey(),
	title: text('title').notNull(),
	description: text('description'),
	position: integer('position').notNull(),
	priority: text('priority', { enum: ['low', 'medium', 'high'] })
		.notNull()
		.default('medium'),
	status: text('status', { enum: ['todo', 'in-progress', 'done'] })
		.notNull()
		.default('todo'),
	timeSpent: integer('time_spent').notNull().default(0),
	dueDate: text('due_date'),
	createdAt: text('created_at').$defaultFn(() => new Date().toISOString()),
	updatedAt: text('updated_at').$defaultFn(() => new Date().toISOString())
})

export type Task = typeof tasks.$inferSelect
export type NewTask = typeof tasks.$inferInsert
