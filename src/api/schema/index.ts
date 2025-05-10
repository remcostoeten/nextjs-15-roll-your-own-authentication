/**
 * Central schema re-export file to avoid circular dependencies.
 *
 * All module-level schema definitions (e.g., user-schema) should be re-exported here.
 * This allows other parts of the app to import from a single source.
 *
 * @pattern export * from '@/modules/<module>/api/schemas/<schema-file>';
 *
 * @example
 * // In src/modules/auth/api/schemas/user-schema.ts:
 * export const users = pgTable('users', {
 *   id: serial('id').primaryKey(),
 * });
 *
 * Then re-export here:
 * export * from '@/modules/auth/api/schemas/user-schema';
 */


export * from '@/modules/auth/api/schemas/profile-schema';
export * from '@/modules/metrics/api/schemas/action-log-schema';
export * from '@/modules/dashboard/models/projects-schema';
export * from '@/modules/workspaces/api/schema/workspace-schema';
export * from '@/modules/auth/api/schemas/user-schema';
export * from '@/modules/workspaces/api/schema/workspace-preferences';