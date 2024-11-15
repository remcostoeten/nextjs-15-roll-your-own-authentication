import { boolean, jsonb, pgTable, text, uuid } from 'drizzle-orm/pg-core';
import { users } from './users';

export const profiles = pgTable('profiles', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id).notNull().unique(),
  bio: text('bio'),
  gender: text('gender'),
  isAdmin: boolean('is_admin').default(false).notNull(),
  socials: jsonb('socials').default({}).notNull(), // Store social links as JSON
});

export type Profile = typeof profiles.$inferSelect;
export type NewProfile = typeof profiles.$inferInsert;
