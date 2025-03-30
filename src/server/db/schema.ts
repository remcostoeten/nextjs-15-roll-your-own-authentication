import { pgTable, text, timestamp, serial, pgEnum } from 'drizzle-orm/pg-core'

export const userRoleEnum = pgEnum('user_role', ['user', 'admin'])

export const users = pgTable('users', {
	id: serial('id').primaryKey(),
	name: text('name').notNull(),
	email: text('email').notNull().unique(),
	password: text('password'),
	role: userRoleEnum('role').default('user').notNull(),
	avatarUrl: text('avatar_url'),
	bio: text('bio'),
	location: text('location'),
	website: text('website'),
	twitter: text('twitter'),
	github: text('github'),
	githubId: text('github_id').unique(),
	authProvider: text('auth_provider').default('local').notNull(),
	createdAt: timestamp('created_at').defaultNow(),
	updatedAt: timestamp('updated_at').defaultNow(),
})

export const sessions = pgTable('sessions', {
	id: serial('id').primaryKey(),
	userId: serial('user_id')
		.references(() => users.id)
		.notNull(),
	token: text('token').notNull(),
	expiresAt: timestamp('expires_at').notNull(),
	createdAt: timestamp('created_at').defaultNow(),
	updatedAt: timestamp('updated_at').defaultNow(),
})

export const notifications = pgTable('notifications', {
    id: serial('id').primaryKey(),
    userId: serial('user_id')
        .references(() => users.id)
        .notNull(),
    title: text('title').notNull(),
    message: text('message').notNull(),
    read: text('read').default('false').notNull(),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
})
