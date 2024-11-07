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
	metadata?: Record<string, any>
}

export type SystemHealth = {
	databaseStatus: 'healthy' | 'degraded' | 'down'
	apiStatus: 'operational' | 'issues' | 'down'
	lastBackup: string
	activeConnections: number
	serverLoad: number
}
