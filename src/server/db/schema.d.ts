import { InferInsertModel, InferSelectModel } from 'drizzle-orm'
import * as schema from './schema'

export type User = InferSelectModel<typeof schema.users>
export type UserInsert = InferInsertModel<typeof schema.users>

export type Session = InferSelectModel<typeof schema.sessions>
export type SessionInsert = InferInsertModel<typeof schema.sessions>

export type EmailVerification = InferSelectModel<
	typeof schema.emailVerifications
>
export type EmailVerificationInsert = InferInsertModel<
	typeof schema.emailVerifications
>

export type PasswordReset = InferSelectModel<typeof schema.passwordResets>
export type PasswordResetInsert = InferInsertModel<typeof schema.passwordResets>

export type RateLimit = InferSelectModel<typeof schema.rateLimits>
export type RateLimitInsert = InferInsertModel<typeof schema.rateLimits>
