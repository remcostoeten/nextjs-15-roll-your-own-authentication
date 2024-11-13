import {
	boolean,
	integer,
	json,
	pgTable,
	serial,
	text,
	timestamp
} from 'drizzle-orm/pg-core'
import { users } from '../users/schema'

export const sessions = pgTable('sessions', {
	id: serial('id').primaryKey(),
	userId: integer('user_id')
		.references(() => users.id)
		.notNull(),

	// Session data
	token: text('token').notNull().unique(),
	expiresAt: timestamp('expires_at').notNull(),
	isValid: boolean('is_valid').default(true),

	// Device information
	ipAddress: text('ip_address'),
	userAgent: text('user_agent'),
	deviceInfo: json('device_info').$type<{
		browser?: string
		os?: string
		device?: string
		isMobile?: boolean
	}>(),

	// Location data (for security)
	lastLocation: json('last_location').$type<{
		country?: string
		city?: string
		ip?: string
	}>(),

	// Session activity
	lastActive: timestamp('last_active'),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at').defaultNow().notNull()
})
