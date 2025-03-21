import { text, integer, sqliteTable } from 'drizzle-orm/sqlite-core'
import { createId } from '@paralleldrive/cuid2'

export const changelogItems = sqliteTable('changelog_items', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => createId()),
	version: text('version').notNull(),
	title: text('title').notNull(),
	description: text('description').notNull(),
	date: text('date').notNull().$defaultFn(() => new Date().toISOString()),
	features: text('features'), // JSON string array
	improvements: text('improvements'), // JSON string array
	bugfixes: text('bugfixes'), // JSON string array
	votes: integer('votes').default(0),
})
