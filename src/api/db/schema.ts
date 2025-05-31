/*
 * This file is responsible for
 * re-exporting all schemas
 * from their respective modules
 */

/*
 * Authentication schemas:
 * - users: User accounts with roles and profile information
 * - sessions: User session management
 * - oauth: OAuth provider connections
 */
export * from '@/modules/authenticatie/schemas';
export * from '@/modules/notifications/server/schemas/schema-notifications';
export * from '@/modules/workspaces/server/schemas/schema-workspaces';
export * from '@/modules/projects/server/schemas/schema-projects';
export * from '@/modules/tasks/server/schemas/schema-tasks';
export * from '@/modules/rollyourownanalytics/server/schemas/schema-analytics';