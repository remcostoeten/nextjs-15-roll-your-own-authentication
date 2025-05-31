'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from 'ui';
import { AnalyticsRepository } from '../../client/analytics-repository';

type TProps = {
	projectId: string;
};

export function ClientAnalyticsRealtime({ projectId }: TProps) {
	const [realtimeVisitors, setRealtimeVisitors] = useState<number>(0);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		async function fetchRealtimeData() {
			try {
				const visitors = await AnalyticsRepository.getRealtimeVisitors(projectId);
				setRealtimeVisitors(visitors);
			} catch (error) {
				console.error('Failed to fetch realtime data:', error);
			} finally {
				setLoading(false);
			}
		}

		fetchRealtimeData();

		// Update every 30 seconds
		const interval = setInterval(fetchRealtimeData, 30000);

		return () => clearInterval(interval);
	}, [projectId]);

	return (
		<Card>
			<CardHeader>
				<CardTitle>Realtime</CardTitle>
				<CardDescription>Live visitor activity and current sessions</CardDescription>
			</CardHeader>
			<CardContent>
				<div className="text-center py-8">
					{loading ? (
						<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
					) : (
						<div>
							<div className="text-4xl font-bold text-green-600 mb-2">
								{realtimeVisitors}
							</div>
							<div className="text-muted-foreground">
								{realtimeVisitors === 1 ? 'visitor' : 'visitors'} active now
							</div>
						</div>
					)}
				</div>
			</CardContent>
		</Card>
	);
}
