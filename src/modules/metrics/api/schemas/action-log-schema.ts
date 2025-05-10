import { pgTable, serial, integer, varchar, timestamp, jsonb, text, index } from 'drizzle-orm/pg-core';
import { users } from 'schema';

export const actionTypes = [
    'LOGIN_SUCCESS',
    'LOGIN_FAIL',
    'REGISTER_SUCCESS',
    'REGISTER_FAIL',
    'LOGOUT',
    'PASSWORD_RESET_REQUEST',
    'PASSWORD_RESET_SUCCESS',
    'VIEW_PAGE',
    'VIEW_DASHBOARD',
    'CREATE_POST',
    'READ_POST',
    'UPDATE_POST',
    'DELETE_POST',
    'UPDATE_PROFILE',
    'MIDDLEWARE_REDIRECT_AUTH',
    'MIDDLEWARE_REDIRECT_UNAUTH',
    'API_ERROR',
    'RATE_LIMIT_EXCEEDED',
    'CUSTOM_ACTION',
] as const;

export type ActionType = typeof actionTypes[number];

export const userActions = pgTable('user_actions', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id, { onDelete: 'set null' }),
  actionType: varchar('action_type', { length: 50, enum: actionTypes }),
  timestamp: timestamp('timestamp', { withTimezone: true }).defaultNow(),
  ipAddress: varchar('ip_address', { length: 45 }),
  userAgent: text('user_agent'),
  path: text('path'),
  country: varchar('country', { length: 100 }),
  region: varchar('region', { length: 100 }),
  city: varchar('city', { length: 100 }),
  details: jsonb('details'),
}, (table) => {
  return {
    userIdx: index('idx_user_actions_userid').on(table.userId),
    actionTypeIdx: index('idx_user_actions_actiontype').on(table.actionType),
    timestampIdx: index('idx_user_actions_timestamp').on(table.timestamp),
  };
});

export type ActionDetails = Record<string, any>;

