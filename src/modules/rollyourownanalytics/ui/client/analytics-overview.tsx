'use client';

import { Card, CardContent, CardHeader, CardTitle } from 'ui';
import type { TAnalyticsMetrics } from '../../types';

type TProps = {
	metrics: TAnalyticsMetrics;
};

export function ClientAnalyticsOverview({ metrics }: TProps) {
	return (
		<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
			<Card>
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="text-sm font-medium">Total Pageviews</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold">
						{metrics.totalPageviews.toLocaleString()}
					</div>
				</CardContent>
			</Card>

			<Card>
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="text-sm font-medium">Unique Visitors</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold">
						{metrics.uniqueVisitors.toLocaleString()}
					</div>
				</CardContent>
			</Card>

			<Card>
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold">
						{metrics.totalSessions.toLocaleString()}
					</div>
				</CardContent>
			</Card>

			<Card>
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="text-sm font-medium">Bounce Rate</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold">
						{(metrics.bounceRate * 100).toFixed(1)}%
					</div>
				</CardContent>
			</Card>

			<Card>
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="text-sm font-medium">Avg. Session Duration</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold">
						{Math.round(metrics.avgSessionDuration / 1000 / 60)}m
					</div>
				</CardContent>
			</Card>

			<Card>
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="text-sm font-medium">Pages per Session</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold">{metrics.pagesPerSession.toFixed(1)}</div>
				</CardContent>
			</Card>

			<Card>
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="text-sm font-medium">Total Events</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold">{metrics.totalEvents.toLocaleString()}</div>
				</CardContent>
			</Card>

			<Card>
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="text-sm font-medium">Active Now</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold text-green-600">
						{metrics.realtimeVisitors}
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
