import {
	pgTable,
	serial,
	varchar,
	text,
	timestamp,
	boolean,
	integer,
} from 'drizzle-orm/pg-core'
import { users } from './schema'
import { workspaces } from './schema'

export const chats = pgTable('chats', {
	id: varchar('id', { length: 36 }).primaryKey(),
	name: varchar('name', { length: 100 }).notNull(),
	workspaceId: integer('workspace_id')
		.notNull()
		.references(() => workspaces.id, { onDelete: 'cascade' }),
	last_message: text('last_message'),
	timestamp: timestamp('timestamp').defaultNow().notNull(),
	createdById: varchar('created_by_id', { length: 128 })
		.notNull()
		.references(() => users.id),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export const messages = pgTable('messages', {
	id: varchar('id', { length: 36 }).primaryKey(),
	chat_id: varchar('chat_id', { length: 36 })
		.notNull()
		.references(() => chats.id, { onDelete: 'cascade' }),
	userId: varchar('user_id', { length: 128 })
		.notNull()
		.references(() => users.id),
	name: varchar('name', { length: 100 }),
	message: text('message').notNull(),
	timestamp: timestamp('timestamp').defaultNow().notNull(),
	attachment: text('attachment'),
	is_favorite: boolean('is_favorite').default(false).notNull(),
})

export const favorites = pgTable('favorites', {
	id: varchar('id', { length: 36 }).primaryKey(),
	message_id: varchar('message_id', { length: 36 })
		.notNull()
		.references(() => messages.id, { onDelete: 'cascade' }),
	user_id: varchar('user_id', { length: 35 })
		.notNull()
		.references(() => users.id),
	timestamp: timestamp('timestamp').defaultNow().notNull(),
})

export const chatMembers = pgTable('chat_members', {
	id: serial('id').primaryKey(),
	chatId: varchar('chat_id', { length: 36 })
		.notNull()
		.references(() => chats.id, { onDelete: 'cascade' }),
	userId: varchar('user_id', { length: 128 })
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' }),
	joinedAt: timestamp('joined_at').defaultNow().notNull(),
	role: varchar('role', { length: 20 }).default('member').notNull(),
})
