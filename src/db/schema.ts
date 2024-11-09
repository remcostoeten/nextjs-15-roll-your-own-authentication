import { createId } from '@paralleldrive/cuid2'
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const users = sqliteTable('users', {
	id: text('id')
		.$defaultFn(() => createId())
		.primaryKey(),
	email: text('email').notNull().unique(),
	password: text('password').notNull(),
	role: text('role', { enum: ['admin', 'user'] })
		.notNull()
		.default('user'),
	createdAt: text('created_at')
		.notNull()
		.$defaultFn(() => new Date().toISOString()),
	updatedAt: text('updated_at')
		.notNull()
		.$defaultFn(() => new Date().toISOString())
})

export const sessions = sqliteTable('sessions', {
	id: text('id')
		.$defaultFn(() => createId())
		.primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' }),
	expiresAt: text('expires_at').notNull(),
	lastUsed: text('last_used')
		.notNull()
		.$defaultFn(() => new Date().toISOString()),
	userAgent: text('user_agent'),
	ipAddress: text('ip_address')
})

export const tasks = sqliteTable('tasks', {
	id: text('id')
		.$defaultFn(() => createId())
		.primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' }),
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

export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert
export type Session = typeof sessions.$inferSelect
export type NewSession = typeof sessions.$inferInsert
export type Task = typeof tasks.$inferSelect
export type NewTask = typeof tasks.$inferInsert
