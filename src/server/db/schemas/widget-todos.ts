import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'
import { users } from './users'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { sql } from 'drizzle-orm'
import { widgetCategories } from './widget-categories'

export const widgetTodos = sqliteTable('widget_todos', {
	id: text('id').primaryKey().notNull(),
	title: text('title').notNull(),
	content: text('content'),
	completed: integer('completed', { mode: 'boolean' }).default(false).notNull(),
	userId: text('user_id')
		.references(() => users.id)
		.notNull(),
	categoryId: text('category_id').references(() => widgetCategories.id),
	tags: text('tags').notNull().default('[]'), // Store as JSON array
	priority: integer('priority').default(0).notNull(), // 0: none, 1: low, 2: medium, 3: high
	createdAt: integer('created_at', { mode: 'timestamp' })
		.default(sql`CURRENT_TIMESTAMP`)
		.notNull(),
	updatedAt: integer('updated_at', { mode: 'timestamp' })
		.default(sql`CURRENT_TIMESTAMP`)
		.notNull(),
})

export const tags = sqliteTable('tags', {
	id: text('id').primaryKey().notNull(),
	name: text('name').notNull(),
	color: text('color').notNull().default('#3b82f6'), // Default blue
})

// Zod schemas for validation
export const insertTodoSchema = createInsertSchema(widgetTodos)
export const selectTodoSchema = createSelectSchema(widgetTodos)

// TypeScript types
export type Todo = typeof widgetTodos.$inferSelect
export type NewTodo = typeof widgetTodos.$inferInsert
export type Tag = typeof tags.$inferSelect
