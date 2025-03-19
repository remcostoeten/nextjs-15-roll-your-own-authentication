import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'
import { sql } from 'drizzle-orm'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { z } from 'zod'

export const users = sqliteTable('users', {
	id: text('id').primaryKey().notNull(),
	email: text('email').unique().notNull(),
	passwordHash: text('password_hash').notNull(),
	firstName: text('first_name'),
	lastName: text('last_name'),
	role: text('role', { enum: ['admin', 'user'] })
		.default('user')
		.notNull(),
	githubId: text('github_id').unique(),
	githubAccessToken: text('github_access_token'),
	avatar: text('avatar').default(''),
	// Profile data
	location: text('location').default(''),
	timezone: text('timezone').default(''),
	lastLogin: integer('last_login', { mode: 'timestamp' }),
	loginStreak: integer('login_streak').default(0),
	accountStatus: text('account_status', {
		enum: ['active', 'inactive', 'suspended'],
	})
		.notNull()
		.default('active'),
	// Timestamps
	createdAt: integer('created_at', { mode: 'timestamp' })
		.default(sql`CURRENT_TIMESTAMP`)
		.notNull(),
	updatedAt: integer('updated_at', { mode: 'timestamp' })
		.default(sql`CURRENT_TIMESTAMP`)
		.notNull(),
})

export const insertUserSchema = createInsertSchema(users, {
	email: z.string().email(),
	role: z.enum(['admin', 'user']).default('user'),
	githubId: z.string().optional(),
	githubAccessToken: z.string().optional(),
})

export const selectUserSchema = createSelectSchema(users)

export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert
