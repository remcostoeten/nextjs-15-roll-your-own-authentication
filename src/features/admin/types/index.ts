/**
 * Types for admin functionality
 * @module AdminTypes
 */

export type AdminDashboardStats = {
	totalUsers: number
	activeUsers: number
	newUsersToday: number
	totalPageViews: number
}

export type UserManagementAction =
	| 'promote_to_admin'
	| 'demote_to_user'
	| 'disable_account'
	| 'enable_account'
	| 'delete_account'

export type AuditLogEntry = {
	id: string
	action: string
	performedBy: string
	targetUser?: string
	timestamp: string
	metadata?: Record<string, string | number | boolean | null>
}

export type SystemHealth = {
	status: 'healthy' | 'degraded' | 'down'
	lastChecked: Date
	services: Record<
		string,
		{
			status: 'up' | 'down'
			latency: number
		}
	>
}

export type AdminAction = {
	type: string
	payload: unknown
	timestamp: Date
}
