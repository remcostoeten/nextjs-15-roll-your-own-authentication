import { NextRequest, NextResponse } from 'next/server';
import { getAnalyticsMetrics } from '@/modules/rollyourownanalytics/server/queries/get-analytics-metrics';
import type { TAnalyticsFilter } from '@/modules/rollyourownanalytics/types';

export async function GET(request: NextRequest) {
	try {
		const { searchParams } = new URL(request.url);
		const projectId = searchParams.get('projectId');

		if (!projectId) {
			return NextResponse.json({ error: 'Project ID is required' }, { status: 400 });
		}

		// Parse filter parameters
		const filter: TAnalyticsFilter = {};

		const startDate = searchParams.get('startDate');
		if (startDate) filter.startDate = new Date(startDate);

		const endDate = searchParams.get('endDate');
		if (endDate) filter.endDate = new Date(endDate);

		const country = searchParams.get('country');
		if (country) filter.country = country;

		const device = searchParams.get('device');
		if (device) filter.device = device;

		const browser = searchParams.get('browser');
		if (browser) filter.browser = browser;

		const page = searchParams.get('page');
		if (page) filter.page = page;

		const metrics = await getAnalyticsMetrics(projectId, filter);

		return NextResponse.json(metrics);
	} catch (error) {
		console.error('Error in metrics API:', error);
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
	}
}
