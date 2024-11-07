import { sessions, users } from '@/db/schema'
import { createId } from '@paralleldrive/cuid2'
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const analyticsPageViews = sqliteTable('analytics_page_views', {
	id: text('id')
		.$defaultFn(() => createId())
		.primaryKey(),
	userId: text('user_id').references(() => users.id, {
		onDelete: 'set null'
	}),
	sessionId: text('session_id').references(() => sessions.id, {
		onDelete: 'set null'
	}),
	pathname: text('pathname').notNull(),
	domain: text('domain').notNull(),
	referrer: text('referrer'),
	userAgent: text('user_agent'),
	duration: integer('duration'),
	createdAt: text('created_at')
		.notNull()
		.$defaultFn(() => new Date().toISOString()),

	// Browser & Device
	browser: text('browser'),
	browserVersion: text('browser_version'),
	os: text('os'),
	device: text('device'),
	screenSize: text('screen_size'),
	viewportSize: text('viewport_size'),

	// Location
	country: text('country'),
	city: text('city'),
	region: text('region'),
	timezone: text('timezone'),

	// Performance
	loadTime: integer('load_time'),
	connectionType: text('connection_type'),

	// User Behavior
	timeOnPage: integer('time_on_page'),
	scrollDepth: integer('scroll_depth'),

	// Campaign
	utmSource: text('utm_source'),
	utmMedium: text('utm_medium'),
	utmCampaign: text('utm_campaign'),

	// Additional
	language: text('language'),
	isBot: integer('is_bot'),
	exitPage: text('exit_page'),
	entryPage: text('entry_page')
})

export const analyticsEvents = sqliteTable('analytics_events', {
	id: text('id')
		.$defaultFn(() => createId())
		.primaryKey(),
	userId: text('user_id').references(() => users.id, {
		onDelete: 'set null'
	}),
	sessionId: text('session_id').references(() => sessions.id, {
		onDelete: 'set null'
	}),
	eventName: text('event_name').notNull(),
	eventData: text('event_data'),
	createdAt: text('created_at')
		.notNull()
		.$defaultFn(() => new Date().toISOString())
})

export const analyticsSessions = sqliteTable('analytics_sessions', {
	id: text('id')
		.$defaultFn(() => createId())
		.primaryKey(),
	userId: text('user_id').references(() => users.id, {
		onDelete: 'set null'
	}),
	firstSeen: text('first_seen')
		.notNull()
		.$defaultFn(() => new Date().toISOString()),
	lastSeen: text('last_seen')
		.notNull()
		.$defaultFn(() => new Date().toISOString()),
	platform: text('platform'),
	device: text('device'),
	browser: text('browser'),
	country: text('country'),
	city: text('city')
})

export const analyticsUserFlows = sqliteTable('analytics_user_flows', {
	id: text('id')
		.$defaultFn(() => createId())
		.primaryKey(),
	sessionId: text('session_id').references(() => sessions.id),
	entryPage: text('entry_page').notNull(),
	exitPage: text('exit_page'),
	pathSequence: text('path_sequence').notNull(), // Stores path as JSON array
	bounced: integer('bounced').notNull(),
	timeSpent: integer('time_spent'),
	createdAt: text('created_at').$defaultFn(() => new Date().toISOString())
})

export type AnalyticsPageView = typeof analyticsPageViews.$inferSelect
export type NewAnalyticsPageView = typeof analyticsPageViews.$inferInsert

export type AnalyticsEvent = typeof analyticsEvents.$inferSelect
export type NewAnalyticsEvent = typeof analyticsEvents.$inferInsert

export type AnalyticsSession = typeof analyticsSessions.$inferSelect
export type NewAnalyticsSession = typeof analyticsSessions.$inferInsert
