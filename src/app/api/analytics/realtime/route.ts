import { NextRequest, NextResponse } from 'next/server';
import { analyticsDb } from '@/modules/rollyourownanalytics/server/db/connection';
import { analyticsSessions } from '@/modules/rollyourownanalytics/server/schemas/schema-analytics';
import { eq, and, gte, count, sql } from 'drizzle-orm';

/**
 * Handles GET requests to provide the real-time count of unique visitors for a specified project.
 *
 * Extracts the `projectId` from the query parameters and returns the number of distinct visitors with sessions that ended within the last five minutes for that project.
 *
 * @returns A JSON response containing the `realtimeVisitors` count, or an error message with the appropriate HTTP status code if the request is invalid or an internal error occurs.
 */
export async function GET(request: NextRequest) {
	try {
		const { searchParams } = new URL(request.url);
		const projectId = searchParams.get('projectId');

		if (!projectId) {
			return NextResponse.json({ error: 'Project ID is required' }, { status: 400 });
		}

		// Get visitors active in the last 5 minutes
		const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);

		const [realtimeData] = await analyticsDb
			.select({
				realtimeVisitors: count(sql`DISTINCT ${analyticsSessions.visitorId}`),
			})
			.from(analyticsSessions)
			.where(
				and(
					eq(analyticsSessions.projectId, projectId),
					gte(analyticsSessions.endedAt, fiveMinutesAgo)
				)
			);

		return NextResponse.json({
			realtimeVisitors: realtimeData?.realtimeVisitors || 0,
		});
	} catch (error) {
		console.error('Error in realtime API:', error);
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
	}
}
