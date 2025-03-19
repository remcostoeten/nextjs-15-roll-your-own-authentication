import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'
import { sql } from 'drizzle-orm'

export * from './users'
export * from './sessions'
export * from './user-metrics'
export * from './activity-logs'
export * from './posts'
export * from './changelog.schema'
export * from './roadmap.schema'

export const users = sqliteTable('users', {
    id: text('id').primaryKey().notNull(),
    email: text('email').unique().notNull(),
    passwordHash: text('password_hash'),
    firstName: text('first_name'),
    lastName: text('last_name'),
    role: text('role', { enum: ['admin', 'user'] }).default('user').notNull(),
    avatar: text('avatar'),
    githubId: text('github_id', { mode: 'text' }).unique(),
    githubAccessToken: text('github_access_token', { mode: 'text' }),
    createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
})
