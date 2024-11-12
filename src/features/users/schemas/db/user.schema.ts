import { createId } from '@paralleldrive/cuid2'
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const users = sqliteTable('users', {
  id: text('id').$defaultFn(() => createId()).primaryKey(),
  email: text('email').notNull().unique(),
  password: text('password'),  // Nullable for OAuth users
  role: text('role', { enum: ['admin', 'user'] }).notNull().default('user'),
  createdAt: text('created_at').$defaultFn(() => new Date().toISOString()),
  updatedAt: text('updated_at').$defaultFn(() => new Date().toISOString()),
  lastLoginAt: text('last_login_at'),
  loginCount: integer('login_count').default(0),
  failedLoginAttempts: integer('failed_login_attempts').default(0),
  lastFailedLoginAt: text('last_failed_login_at'),
  isLocked: integer('is_locked', { mode: 'boolean' }).default(false),
  lockExpiresAt: text('lock_expires_at'),
  emailVerified: integer('email_verified', { mode: 'boolean' }).default(false),
  emailVerificationToken: text('email_verification_token'),
  emailVerificationExpires: text('email_verification_expires'),
})

export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert
