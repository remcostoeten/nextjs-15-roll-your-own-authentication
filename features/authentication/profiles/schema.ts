import { integer, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core'
import { users } from '../users/schema'

export const profiles = pgTable('profiles', {
	id: serial('id').primaryKey(),
	userId: integer('user_id')
		.references(() => users.id)
		.notNull()
		.unique(),

	// Profile information
	avatar: text('avatar'),
	bio: text('bio'),
	phoneNumber: text('phone_number'),
	location: text('location'),
	website: text('website'),
	company: text('company'),
	jobTitle: text('job_title'),

	// Social links
	twitter: text('twitter'),
	github: text('github'),
	linkedin: text('linkedin'),

	// Activity tracking
	lastSeen: timestamp('last_seen'),

	// Timestamps
	createdAt: timestamp('created_at').defaultNow(),
	updatedAt: timestamp('updated_at').defaultNow()
})
