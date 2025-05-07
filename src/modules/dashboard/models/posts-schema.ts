import { pgTable, serial, varchar, jsonb, timestamp, integer } from 'drizzle-orm/pg-core'

export const posts = pgTable('posts', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }),
  content: jsonb('content'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
  authorId: integer('author_id'),
  deletedAt: timestamp('deleted_at', { withTimezone: true }),
  visibility: varchar('visibility', { length: 16 }).default('private'),
  shareId: varchar('share_id', { length: 32 })
}) 