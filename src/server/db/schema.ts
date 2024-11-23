import {
	boolean,
	integer,
	jsonb,
	pgTable,
	serial,
	text,
	timestamp,
	varchar
} from 'drizzle-orm/pg-core'

export const users = pgTable('users', {
	id: serial('id').primaryKey(),
	email: text('email').notNull().unique(),
	password: text('password').notNull(),
	name: text('name'),
	role: varchar('role', { length: 50 }).notNull().default('user'),
	emailVerified: boolean('email_verified').default(false),
	createdAt: timestamp('created_at').defaultNow(),
	updatedAt: timestamp('updated_at').defaultNow(),
	avatar: varchar('avatar', { length: 255 })
})

export const sessions = pgTable('sessions', {
	id: serial('id').primaryKey(),
	userId: integer('user_id')
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' }),
	token: text('token').notNull().unique(),
	expiresAt: timestamp('expires_at').notNull(),
	createdAt: timestamp('created_at').defaultNow()
})

export const emailVerifications = pgTable('email_verifications', {
	id: serial('id').primaryKey(),
	userId: integer('user_id')
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' }),
	token: varchar('token', { length: 255 }).notNull().unique(),
	expiresAt: timestamp('expires_at').notNull(),
	createdAt: timestamp('created_at').defaultNow()
})

export const passwordResets = pgTable('password_resets', {
	id: serial('id').primaryKey(),
	userId: integer('user_id')
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' }),
	token: varchar('token', { length: 255 }).notNull().unique(),
	expiresAt: timestamp('expires_at').notNull(),
	createdAt: timestamp('created_at').defaultNow(),
	used: boolean('used').default(false)
})

export const rateLimits = pgTable('rate_limits', {
	id: serial('id').primaryKey(),
	key: varchar('key', { length: 255 }).notNull().unique(),
	points: integer('points').notNull().default(0),
	expire: timestamp('expire').notNull(),
	createdAt: timestamp('created_at').defaultNow()
})

export const loginHistory = pgTable('login_history', {
	id: serial('id').primaryKey(),
	userId: integer('user_id')
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' }),
	timestamp: timestamp('timestamp').defaultNow().notNull(),
	userAgent: text('user_agent'),
	ipAddress: varchar('ip_address', { length: 45 }),
	location: jsonb('location').default('{}'),
	success: boolean('success').default(true),
	month: timestamp('month').defaultNow().notNull(),
	count: integer('count').default(1).notNull()
})
