/**
 * Activity Logger Utility
 *
 * A utility for logging various types of user activities including CRUD operations,
 * authentication events, and other system activities.
 */

import { logActivity } from '@/modules/user-metrics/api'

// Define activity types for better type safety
export type ActivityType =
	// Authentication activities
	| 'login_success'
	| 'login_failure'
	| 'logout'
	| 'password_change'
	| 'registration'
	| 'registration_failure'
	| 'register_success'
	| 'register_failure'
	| 'token_refresh'
	| 'password_reset_request'
	| 'password_reset_success'
	| 'password_reset_failure'

	// CRUD activities
	| 'create'
	| 'read'
	| 'update'
	| 'delete'

	// System activities
	| 'system_error'
	| 'api_access'
	| 'export_data'
	| 'import_data'
	| 'settings_change'

	// Custom activity (for flexibility)
	| 'custom'

// Interfaces for the activity logger
export interface ActivityLoggerOptions {
	userId: string
	type: ActivityType
	entity?: string // Which entity was affected (e.g., 'user', 'post', 'comment')
	entityId?: string // ID of the affected entity
	details?: string // Additional details about the activity
	metadata?: Record<string, any> // Optional additional metadata
	ip?: string
	userAgent?: string
}

interface ActivityLog {
	type: ActivityType;
	userId: string;
	details: string;
	metadata?: Record<string, unknown>;
	timestamp?: Date;
}

/**
 * Log a user activity
 *
 * @param options ActivityLoggerOptions object containing activity details
 * @returns The result of the activity logging operation
 */
export async function logUserActivity({
	type,
	userId,
	details,
	metadata = {},
	timestamp = new Date(),
}: ActivityLog): Promise<void> {
	// In a production environment, you would want to store this in a database
	// For now, we'll just console.log it
	console.log({
		type,
		userId,
		details,
		metadata,
		timestamp,
	});
}
