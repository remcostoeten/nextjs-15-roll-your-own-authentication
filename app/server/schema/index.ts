import {
	activityLogs,
	profiles,
	sessions,
	users
} from '@/features/authentication'

export const schema = {
	users,
	profiles,
	sessions,
	activityLogs
}

// Re-export for convenience
export { activityLogs, profiles, sessions, users }
