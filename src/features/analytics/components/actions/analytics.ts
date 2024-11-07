'use server'

import { db } from '@/db'
import { users } from '@/db/schema'
import {
	analyticsPageViews,
	analyticsSessions,
	type AnalyticsPageView,
	type AnalyticsSession
} from '@/features/analytics/db'
import { isAdmin } from '@/shared/utilities/get-admin'
import { desc, eq, sql } from 'drizzle-orm'

export async function getAnalytics() {
	// Check admin status before allowing access to analytics data
	const adminStatus = await isAdmin()

	if (!adminStatus) {
		throw new Error('Unauthorized access to analytics')
	}

	try {
		// Get daily page views for the last 30 days
		const dailyViews = await db
			.select({
				date: sql`date(created_at)`.as('date'),
				views: sql`count(*)`.as('count')
			})
			.from(analyticsPageViews)
			.groupBy(sql`date(created_at)`)
			.orderBy(desc(sql`date(created_at)`))
			.limit(30)

		// Get total page views
		const [totalViews] = await db
			.select({
				count: sql`count(*)`.as('count')
			})
			.from(analyticsPageViews)

		// Get most viewed pages
		const topPages = await db
			.select({
				pathname: analyticsPageViews.pathname,
				views: sql`count(*)`.as('count')
			})
			.from(analyticsPageViews)
			.groupBy(analyticsPageViews.pathname)
			.orderBy(desc(sql`count(*)`))
			.limit(5)

		return {
			dailyViews,
			totalViews: totalViews.count,
			topPages
		}
	} catch (error) {
		console.error('Failed to fetch analytics:', error)
		throw new Error('Failed to fetch analytics')
	}
}

/**
 * Calculate average session duration in seconds
 */
function calculateAverageSessionDuration(sessions: AnalyticsSession[]): number {
	if (sessions.length === 0) return 0

	const durations = sessions.map((session) => {
		const start = new Date(session.firstSeen).getTime()
		const end = new Date(session.lastSeen).getTime()
		return (end - start) / 1000 // Convert to seconds
	})

	return durations.reduce((acc, curr) => acc + curr, 0) / sessions.length
}

/**
 * Get most visited pages with visit counts
 */
function getMostVisitedPages(
	pageViews: AnalyticsPageView[]
): { pathname: string; count: number }[] {
	const pageCount = new Map<string, number>()

	pageViews.forEach((view) => {
		const count = pageCount.get(view.pathname) || 0
		pageCount.set(view.pathname, count + 1)
	})

	return Array.from(pageCount.entries())
		.map(([pathname, count]) => ({ pathname, count }))
		.sort((a, b) => b.count - a.count)
}

/**
 * Get top referrers with counts
 */
function getTopReferrers(
	pageViews: AnalyticsPageView[]
): { referrer: string; count: number }[] {
	const referrerCount = new Map<string, number>()

	pageViews.forEach((view) => {
		if (!view.referrer) return
		const count = referrerCount.get(view.referrer) || 0
		referrerCount.set(view.referrer, count + 1)
	})

	return Array.from(referrerCount.entries())
		.map(([referrer, count]) => ({ referrer, count }))
		.sort((a, b) => b.count - a.count)
}

/**
 * Get device usage breakdown
 */
function getDeviceBreakdown(
	sessions: AnalyticsSession[]
): { device: string; count: number }[] {
	const deviceCount = new Map<string, number>()

	sessions.forEach((session) => {
		if (!session.device) return
		const count = deviceCount.get(session.device) || 0
		deviceCount.set(session.device, count + 1)
	})

	return Array.from(deviceCount.entries())
		.map(([device, count]) => ({ device, count }))
		.sort((a, b) => b.count - a.count)
}

/**
 * Get browser usage breakdown
 */
function getBrowserBreakdown(
	sessions: AnalyticsSession[]
): { browser: string; count: number }[] {
	const browserCount = new Map<string, number>()

	sessions.forEach((session) => {
		if (!session.browser) return
		const count = browserCount.get(session.browser) || 0
		browserCount.set(session.browser, count + 1)
	})

	return Array.from(browserCount.entries())
		.map(([browser, count]) => ({ browser, count }))
		.sort((a, b) => b.count - a.count)
}

/**
 * Get country breakdown
 */
function getCountryBreakdown(
	sessions: AnalyticsSession[]
): { country: string; count: number }[] {
	const countryCount = new Map<string, number>()

	sessions.forEach((session) => {
		if (!session.country) return
		const count = countryCount.get(session.country) || 0
		countryCount.set(session.country, count + 1)
	})

	return Array.from(countryCount.entries())
		.map(([country, count]) => ({ country, count }))
		.sort((a, b) => b.count - a.count)
}

/**
 * Get detailed analytics for a specific user
 */
export async function getUserAnalytics(userId: string) {
	const adminStatus = await isAdmin()
	if (!adminStatus) throw new Error('Unauthorized')

	try {
		// Get user info
		const [user] = await db.select().from(users).where(eq(users.id, userId))

		// Get sessions
		const sessions = await db
			.select()
			.from(analyticsSessions)
			.where(eq(analyticsSessions.userId, userId))
			.orderBy(desc(analyticsSessions.firstSeen))

		// Get page views
		const pageViews = await db
			.select()
			.from(analyticsPageViews)
			.where(eq(analyticsPageViews.userId, userId))
			.orderBy(desc(analyticsPageViews.createdAt))

		// Calculate metadata
		const metadata = {
			totalSessions: sessions.length,
			averageSessionDuration: calculateAverageSessionDuration(sessions),
			mostVisitedPages: getMostVisitedPages(pageViews),
			topReferrers: getTopReferrers(pageViews),
			devices: getDeviceBreakdown(sessions),
			browsers: getBrowserBreakdown(sessions),
			countries: getCountryBreakdown(sessions)
		}

		return {
			user,
			sessions,
			pageViews,
			metadata
		}
	} catch (error) {
		console.error('Failed to fetch user analytics:', error)
		throw new Error('Failed to fetch user analytics')
	}
}
