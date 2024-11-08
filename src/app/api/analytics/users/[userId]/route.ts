import { db } from '@/db'
import { analyticsPageViews } from '@/features/analytics/db'
import { eq, sql } from 'drizzle-orm'
import { NextRequest } from 'next/server'

export async function GET(
	request: NextRequest,
	{ params }: { params: { userId: string } }
) {
	try {
		const userId = params.userId

		// Get total views
		const viewsResult = await db
			.select({
				count: sql<number>`count(*)`
			})
			.from(analyticsPageViews)
			.where(eq(analyticsPageViews.userId, userId))

		// Get last visit
		const lastVisitResult = await db
			.select({
				lastVisit: sql<string>`max(${analyticsPageViews.createdAt})`
			})
			.from(analyticsPageViews)
			.where(eq(analyticsPageViews.userId, userId))

		// Get top pages
		const topPagesResult = await db
			.select({
				pathname: analyticsPageViews.pathname,
				views: sql<number>`count(*)`
			})
			.from(analyticsPageViews)
			.where(eq(analyticsPageViews.userId, userId))
			.groupBy(analyticsPageViews.pathname)
			.orderBy(sql`count(*) desc`)
			.limit(10)

		return Response.json({
			totalViews: viewsResult[0]?.count || 0,
			lastVisit: lastVisitResult[0]?.lastVisit || null,
			topPages: topPagesResult.map((page) => ({
				pathname: page.pathname,
				views: Number(page.views)
			}))
		})
	} catch (error) {
		console.error('Failed to fetch user analytics:', error)
		return new Response('Internal Server Error', { status: 500 })
	}
}
