'use server'

import { db } from '@/db'
import { analyticsPageViews } from '@/features/analytics/db'

type Analytics = {
	totalViews: number
	topPages: Array<{
		pathname: string
		views: number
	}>
}

export async function getAnalytics(): Promise<Analytics> {
	const views = await db
		.select({
			pathname: analyticsPageViews.pathname,
			count: sql`count(*)`
		})
		.from(analyticsPageViews)
		.groupBy(analyticsPageViews.pathname)

	const totalViews = views.reduce((acc, curr) => acc + Number(curr.count), 0)

	const topPages = views
		.map((view) => ({
			pathname: view.pathname,
			views: Number(view.count)
		}))
		.sort((a, b) => b.views - a.views)

	return {
		totalViews,
		topPages
	}
}
