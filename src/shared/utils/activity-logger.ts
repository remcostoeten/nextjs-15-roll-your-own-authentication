/**
 * Activity Logger Utility
 * 
 * A utility for logging various types of user activities including CRUD operations,
 * authentication events, and other system activities.
 */

import { logActivity } from '@/modules/user-metrics/api';

// Define activity types for better type safety
export type ActivityType =
    // Authentication activities
    | 'login_success'
    | 'login_failure'
    | 'logout'
    | 'password_reset'
    | 'password_change'
    | 'registration'
    | 'registration_failure'

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
    | 'custom';

// Interfaces for the activity logger
export interface ActivityLoggerOptions {
    userId: string;
    type: ActivityType;
    entity?: string;      // Which entity was affected (e.g., 'user', 'post', 'comment')
    entityId?: string;    // ID of the affected entity
    details?: string;     // Additional details about the activity
    metadata?: Record<string, any>; // Optional additional metadata
    ip?: string;
    userAgent?: string;
}

/**
 * Log a user activity
 * 
 * @param options ActivityLoggerOptions object containing activity details
 * @returns The result of the activity logging operation
 */
export async function logUserActivity(options: ActivityLoggerOptions) {
    try {
        // Format the activity details
        let actionString = '';
        let detailsString = '';

        const timestamp = new Date().toISOString();
        const deviceInfo = options.userAgent
            ? `from ${options.userAgent}`
            : 'from unknown device';
        const ipInfo = options.ip
            ? `(IP: ${options.ip})`
            : '';

        // Format the action based on activity type
        switch (options.type) {
            // Authentication activities
            case 'login_success':
                actionString = 'User login';
                detailsString = `Successful login ${deviceInfo} ${ipInfo} at ${timestamp}`;
                break;
            case 'login_failure':
                actionString = 'Failed login attempt';
                detailsString = `Failed login attempt ${deviceInfo} ${ipInfo} at ${timestamp}`;
                break;
            case 'logout':
                actionString = 'User logout';
                detailsString = `Logged out ${deviceInfo} ${ipInfo} at ${timestamp}`;
                break;
            case 'password_reset':
                actionString = 'Password reset';
                detailsString = `Password reset ${deviceInfo} ${ipInfo} at ${timestamp}`;
                break;
            case 'password_change':
                actionString = 'Password change';
                detailsString = `Password changed ${deviceInfo} ${ipInfo} at ${timestamp}`;
                break;
            case 'registration':
                actionString = 'User registration';
                detailsString = `Account created ${deviceInfo} ${ipInfo} at ${timestamp}`;
                break;
            case 'registration_failure':
                actionString = 'Failed registration attempt';
                detailsString = `Failed registration attempt ${deviceInfo} ${ipInfo} at ${timestamp}`;
                break;

            // CRUD activities
            case 'create':
                actionString = options.entity ? `${options.entity} created` : 'Resource created';
                detailsString = `Created ${options.entity || 'resource'}${options.entityId ? ` (ID: ${options.entityId})` : ''} at ${timestamp}`;
                break;
            case 'read':
                actionString = options.entity ? `${options.entity} accessed` : 'Resource accessed';
                detailsString = `Accessed ${options.entity || 'resource'}${options.entityId ? ` (ID: ${options.entityId})` : ''} at ${timestamp}`;
                break;
            case 'update':
                actionString = options.entity ? `${options.entity} updated` : 'Resource updated';
                detailsString = `Updated ${options.entity || 'resource'}${options.entityId ? ` (ID: ${options.entityId})` : ''} at ${timestamp}`;
                break;
            case 'delete':
                actionString = options.entity ? `${options.entity} deleted` : 'Resource deleted';
                detailsString = `Deleted ${options.entity || 'resource'}${options.entityId ? ` (ID: ${options.entityId})` : ''} at ${timestamp}`;
                break;

            // System activities
            case 'system_error':
                actionString = 'System error';
                detailsString = `System error encountered${options.details ? `: ${options.details}` : ''} at ${timestamp}`;
                break;
            case 'api_access':
                actionString = 'API accessed';
                detailsString = `API endpoint accessed ${deviceInfo} ${ipInfo} at ${timestamp}`;
                break;
            case 'export_data':
                actionString = 'Data export';
                detailsString = `Data exported ${deviceInfo} ${ipInfo} at ${timestamp}`;
                break;
            case 'import_data':
                actionString = 'Data import';
                detailsString = `Data imported ${deviceInfo} ${ipInfo} at ${timestamp}`;
                break;
            case 'settings_change':
                actionString = 'Settings changed';
                detailsString = `Settings updated ${deviceInfo} ${ipInfo} at ${timestamp}`;
                break;

            // Custom activity
            case 'custom':
                actionString = options.details || 'Custom activity';
                detailsString = `${options.details || 'Custom activity'} at ${timestamp}`;
                break;

            default:
                actionString = 'Unknown activity';
                detailsString = `Unknown activity at ${timestamp}`;
        }

        // Add metadata if provided
        if (options.metadata) {
            try {
                const metadataString = JSON.stringify(options.metadata);
                detailsString += ` | Metadata: ${metadataString}`;
            } catch (e) {
                console.error('Error serializing activity metadata:', e);
            }
        }

        // Override details if explicitly provided
        if (options.details) {
            detailsString = options.details;
        }

        // Log the activity using the existing logActivity function
        return await logActivity({
            userId: options.userId,
            action: actionString,
            details: detailsString
        });
    } catch (error) {
        console.error('Failed to log user activity:', error);
        // Return null instead of throwing to prevent activity logging failures
        // from breaking application flow
        return null;
    }
} 