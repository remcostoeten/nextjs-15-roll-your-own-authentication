import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'
import { relations } from 'drizzle-orm'
import { users } from './users'
import { createId } from '@paralleldrive/cuid2'

export const userMetrics = sqliteTable('user_metrics', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => createId()),
	userId: text('user_id')
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' }),
	loginCount: integer('login_count').default(0),
	lastActive: integer('last_active', { mode: 'timestamp' }),
	totalSessions: integer('total_sessions').default(0),
	createdAt: integer('created_at', { mode: 'timestamp' })
		.$defaultFn(() => new Date())
		.notNull(),
	updatedAt: integer('updated_at', { mode: 'timestamp' })
		.$defaultFn(() => new Date())
		.notNull(),
})

export const userMetricsRelations = relations(userMetrics, ({ one }) => ({
	user: one(users, {
		fields: [userMetrics.userId],
		references: [users.id],
	}),
}))

export type UserMetric = typeof userMetrics.$inferSelect
export type NewUserMetric = typeof userMetrics.$inferInsert
