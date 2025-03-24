import { sql } from 'drizzle-orm';
import { pgTable, text, timestamp, boolean, varchar, uuid } from 'drizzle-orm/pg-core';

export const errorReports = pgTable('error_reports', {
  id: uuid('id').defaultRandom().primaryKey(),
  url: text('url').notNull(),
  previousUrl: text('previous_url'),
  timestamp: timestamp('timestamp').default(sql`CURRENT_TIMESTAMP`),
  userAgent: text('user_agent'),
  browserInfo: text('browser_info'),
  systemInfo: text('system_info'),
  wasAuthenticated: boolean('was_authenticated').default(false),
  userId: uuid('user_id'),
  userMessage: text('user_message'),
  errorMessage: text('error_message'),
  statusCode: varchar('status_code', { length: 10 }),
  isResolved: boolean('is_resolved').default(false),
  stackTrace: text('stack_trace'),
});
