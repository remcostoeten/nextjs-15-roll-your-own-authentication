import { pgTable, serial, varchar, timestamp } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { userProfiles } from './profile-schema';

export const roles = ['user', 'admin'] as const;
export type Role = (typeof roles)[number];

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).unique(),
  username: varchar('username', { length: 255 }).unique(),
  passwordHash: varchar('password_hash', { length: 255 }),
  role: varchar('role', { length: 20, enum: roles }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
});

export const usersRelations = relations(users, ({ one }) => ({
  profile: one(userProfiles, {
    fields: [users.id],
    references: [userProfiles.userId],
  }),
}));
