import {
	analyticsEvents,
	analyticsPageViews,
	analyticsSessions,
	type AnalyticsEvent,
	type AnalyticsPageView,
	type AnalyticsSession,
	type NewAnalyticsEvent,
	type NewAnalyticsPageView,
	type NewAnalyticsSession
} from '@/features/analytics/db'
import { createId } from '@paralleldrive/cuid2'
import { sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const users = sqliteTable('users', {
	id: text('id')
		.$defaultFn(() => createId())
		.primaryKey(),
	email: text('email').notNull().unique(),
	password: text('password').notNull(),
	createdAt: text('created_at')
		.notNull()
		.$defaultFn(() => new Date().toISOString()),
	role: text('role', { enum: ['user', 'admin'] })
		.notNull()
		.default('user')
})

export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert

export const sessions = sqliteTable('sessions', {
	id: text('id')
		.$defaultFn(() => createId())
		.primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' }),
	lastUsed: text('last_used')
		.notNull()
		.$defaultFn(() => new Date().toISOString()),
	userAgent: text('user_agent'),
	ipAddress: text('ip_address'),
	expiresAt: text('expires_at').notNull()
})

export {
	analyticsEvents,
	analyticsPageViews,
	analyticsSessions,
	type AnalyticsEvent,
	type AnalyticsPageView,
	type AnalyticsSession,
	type NewAnalyticsEvent,
	type NewAnalyticsPageView,
	type NewAnalyticsSession
}
