import { text, integer, timestamp, pgTable } from 'drizzle-orm/pg-core'
import { createId } from '@paralleldrive/cuid2'

export const changelogItems = pgTable('changelog_items', {
    id: text('id').primaryKey().$defaultFn(() => createId()),
    version: text('version').notNull(),
    title: text('title').notNull(),
    description: text('description').notNull(),
    date: timestamp('date', { mode: 'date' }).notNull().defaultNow(),
    features: text('features'), // JSON string array
    improvements: text('improvements'), // JSON string array 
    bugfixes: text('bugfixes'), // JSON string array
    votes: integer('votes').default(0)
}) 