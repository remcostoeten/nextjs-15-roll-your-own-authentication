import { activityLogs } from '@/features/authentication/activity-logs/schema'
import { profiles } from '@/features/authentication/profiles/schema'
import { sessions } from '@/features/authentication/sessions/schema'
import { users } from '@/features/authentication/users/schema'
import { rateLimits } from './schema/rate-limits'

// Export individual schemas
export { activityLogs, profiles, rateLimits, sessions, users }

// Export combined schema object
export const schema = {
	activityLogs,
	profiles,
	sessions,
	users,
	rateLimits
} as const

// Export types from schemas
export type { ActivityType } from '@/features/authentication/activity-logs/schema'

// Export table types
export type Users = typeof users
export type Profiles = typeof profiles
export type Sessions = typeof sessions
export type ActivityLogs = typeof activityLogs
export type RateLimits = typeof rateLimits

// Export combined schema type
export type Schema = typeof schema
