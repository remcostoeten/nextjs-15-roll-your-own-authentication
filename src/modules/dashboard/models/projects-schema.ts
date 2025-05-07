import { pgTable, serial, varchar, timestamp, integer } from 'drizzle-orm/pg-core'

export const projects = pgTable('projects', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }),
  status: varchar('status', { length: 32 }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  ownerId: integer('owner_id')
}) 