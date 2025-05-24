import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

export const UserRole = {
    ADMIN: 'admin',
    USER: 'user',
} as const;

export type TUserRole = (typeof UserRole)[keyof typeof UserRole];

export const users = pgTable('users', {
    id: uuid('id').defaultRandom().primaryKey(),
    email: text('email').notNull().unique(),
    password: text('password'),  // Make password optional for OAuth users
    role: text('role', { enum: ['admin', 'user'] }).notNull().default('user'),
    name: text('name'),
    avatar: text('avatar'),
    emailVerified: timestamp('email_verified_at'),
    lastLoginAt: timestamp('last_login_at'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
