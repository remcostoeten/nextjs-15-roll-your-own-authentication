import {
	boolean,
	integer,
	pgTable,
	serial,
	text,
	timestamp
} from 'drizzle-orm/pg-core'

export const users = pgTable('users', {
	id: serial('id').primaryKey(),
	name: text('name'),
	email: text('email').notNull().unique(),
	password: text('password').notNull(),
	role: text('role').notNull().default('user'),
	emailVerified: boolean('email_verified').default(false),
	loginAttempts: integer('login_attempts').default(0),
	lastLoginAttempt: timestamp('last_login_attempt'),
	passwordChangedAt: timestamp('password_changed_at'),
	passwordResetToken: text('password_reset_token'),
	passwordResetExpires: timestamp('password_reset_expires'),
	createdAt: timestamp('created_at').defaultNow(),
	updatedAt: timestamp('updated_at').defaultNow()
})
