//@ts-nocheck

import { sql } from 'drizzle-orm';
import { integer, sqliteTable, text, real } from 'drizzle-orm/sqlite-core';

export const analyticsEvents = sqliteTable('analytics_events', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	projectId: text('project_id').notNull(),
	sessionId: text('session_id').notNull(),
	type: text('type').notNull(), // 'pageview', 'click', 'form_submit', 'scroll', 'custom'
	name: text('name'),
	url: text('url').notNull(),
	pathname: text('pathname').notNull(),
	referrer: text('referrer'),
	title: text('title'),
	userAgent: text('user_agent'),
	country: text('country'),
	city: text('city'),
	region: text('region'),
	timezone: text('timezone'),
	language: text('language'),
	device: text('device'), // 'desktop', 'mobile', 'tablet'
	browser: text('browser'),
	os: text('os'),
	screenWidth: integer('screen_width'),
	screenHeight: integer('screen_height'),
	viewportWidth: integer('viewport_width'),
	viewportHeight: integer('viewport_height'),
	timestamp: integer('timestamp', { mode: 'timestamp' }).notNull(),
	duration: integer('duration'), // time on page in milliseconds
	scrollDepth: real('scroll_depth'), // percentage 0-100
	exitPage: integer('exit_page', { mode: 'boolean' }).default(false),
	bounced: integer('bounced', { mode: 'boolean' }).default(false),
	utmSource: text('utm_source'),
	utmMedium: text('utm_medium'),
	utmCampaign: text('utm_campaign'),
	utmTerm: text('utm_term'),
	utmContent: text('utm_content'),
	metadata: text('metadata', { mode: 'json' }), // additional custom data
	createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(unixepoch())`),
});

export const analyticsSessions = sqliteTable('analytics_sessions', {
	id: text('id').primaryKey(),
	projectId: text('project_id').notNull(),
	userId: text('user_id'), // optional for authenticated users
	visitorId: text('visitor_id').notNull(), // persistent anonymous ID
	userAgent: text('user_agent'),
	ipAddress: text('ip_address'),
	country: text('country'),
	city: text('city'),
	region: text('region'),
	timezone: text('timezone'),
	language: text('language'),
	device: text('device'),
	browser: text('browser'),
	os: text('os'),
	referrer: text('referrer'),
	utmSource: text('utm_source'),
	utmMedium: text('utm_medium'),
	utmCampaign: text('utm_campaign'),
	utmTerm: text('utm_term'),
	utmContent: text('utm_content'),
	startedAt: integer('started_at', { mode: 'timestamp' }).notNull(),
	endedAt: integer('ended_at', { mode: 'timestamp' }),
	duration: integer('duration'), // session length in milliseconds
	pageviews: integer('pageviews').default(0),
	events: integer('events').default(0),
	bounced: integer('bounced', { mode: 'boolean' }).default(false),
	createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(unixepoch())`),
	updatedAt: integer('updated_at', { mode: 'timestamp' }).default(sql`(unixepoch())`),
});

export const analyticsProjects = sqliteTable('analytics_projects', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	name: text('name').notNull(),
	domain: text('domain').notNull(),
	publicKey: text('public_key')
		.notNull()
		.$defaultFn(() => crypto.randomUUID()),
	isActive: integer('is_active', { mode: 'boolean' }).default(true),
	settings: text('settings', { mode: 'json' }),
	createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(unixepoch())`),
	updatedAt: integer('updated_at', { mode: 'timestamp' }).default(sql`(unixepoch())`),
});

export const analyticsFunnels = sqliteTable('analytics_funnels', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	projectId: text('project_id').notNull(),
	name: text('name').notNull(),
	description: text('description'),
	steps: text('steps', { mode: 'json' }).notNull(), // Array of step definitions
	isActive: integer('is_active', { mode: 'boolean' }).default(true),
	createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(unixepoch())`),
	updatedAt: integer('updated_at', { mode: 'timestamp' }).default(sql`(unixepoch())`),
});

export const analyticsGoals = sqliteTable('analytics_goals', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	projectId: text('project_id').notNull(),
	name: text('name').notNull(),
	description: text('description'),
	type: text('type').notNull(), // 'pageview', 'event', 'duration'
	conditions: text('conditions', { mode: 'json' }).notNull(),
	value: real('value'), // monetary value if applicable
	isActive: integer('is_active', { mode: 'boolean' }).default(true),
	createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(unixepoch())`),
	updatedAt: integer('updated_at', { mode: 'timestamp' }).default(sql`(unixepoch())`),
});
