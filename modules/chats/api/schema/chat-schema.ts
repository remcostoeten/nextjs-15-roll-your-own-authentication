import { pgTable, varchar, text, timestamp, boolean } from 'drizzle-orm/pg-core'

export const chats = pgTable('chats', {
	id: varchar('id', { length: 36 }).primaryKey(),
	name: varchar('name', { length: 100 }).notNull(),
	last_message: text('last_message'),
	timestamp: timestamp('timestamp').defaultNow().notNull(),
})

export const messages = pgTable('messages', {
	id: varchar('id', { length: 36 }).primaryKey(),
	chat_id: varchar('chat_id', { length: 36 }).notNull(),
	name: varchar('name', { length: 100 }).notNull(),
	message: text('message').notNull(),
	timestamp: timestamp('timestamp').defaultNow().notNull(),
	attachment: text('attachment'),
	is_favorite: boolean('is_favorite').default(false).notNull(),
})

export const favorites = pgTable('favorites', {
	id: varchar('id', { length: 36 }).primaryKey(),
	message_id: varchar('message_id', { length: 36 }).notNull(),
	user_id: varchar('user_id', { length: 35 }).notNull(),
	timestamp: timestamp('timestamp').defaultNow().notNull(),
})
