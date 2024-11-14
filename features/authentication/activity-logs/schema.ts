import {
	integer,
	json,
	pgTable,
	serial,
	text,
	timestamp
} from 'drizzle-orm/pg-core'
import { users } from '../users/schema'

export type ActivityType =
	| 'login'
	| 'login_failed'
	| 'logout'
	| 'register'
	| 'password_reset'
	| 'password_changed'
	| 'profile_updated'
	| 'email_changed'
	| 'role_changed'
	| 'account_created'
	| 'account_verified'

export const activityLogs = pgTable('activity_logs', {
	id: serial('id').primaryKey(),
	userId: integer('user_id')
		.references(() => users.id)
		.notNull(),

	// Activity details
	type: text('type').notNull().$type<ActivityType>(),
	status: text('status').notNull().default('success'),
	ipAddress: text('ip_address'),
	userAgent: text('user_agent'),

	// Location data (optional)
	location: json('location').$type<{
		country?: string
		city?: string
		region?: string
		latitude?: number
		longitude?: number
	}>(),

	// Additional context
	details: json('details').$type<{
		message?: string
		error?: string
		metadata?: Record<string, unknown>
	}>(),

	// Timestamps
	createdAt: timestamp('created_at').defaultNow().notNull()
})
