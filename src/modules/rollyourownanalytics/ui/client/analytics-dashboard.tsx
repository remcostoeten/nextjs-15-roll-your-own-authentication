'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, Badge, CardHeader, CardTitle } from 'ui';
import { AnalyticsRepository } from '../../client/analytics-repository';
import type { TAnalyticsFilter, TAnalyticsMetrics, TAnalyticsProject } from '../../types';
import { ClientAnalyticsOverview } from './analytics-overview';

type TProps = {
	projectId: string;
	filter?: TAnalyticsFilter;
};

export function ClientAnalyticsDashboard({ projectId, filter = {} }: TProps) {
	const [project, setProject] = useState<TAnalyticsProject | null>(null);
	const [metrics, setMetrics] = useState<TAnalyticsMetrics | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		async function fetchData() {
			try {
				setLoading(true);
				setError(null);

				const [projectData, metricsData] = await Promise.all([
					AnalyticsRepository.getProject(projectId),
					AnalyticsRepository.getMetrics(projectId, filter),
				]);

				setProject(projectData);
				setMetrics(metricsData);
			} catch (err) {
				console.error('Failed to fetch analytics data:', err);
				setError(err instanceof Error ? err.message : 'Failed to load data');
			} finally {
				setLoading(false);
			}
		}

		if (projectId) {
			fetchData();
		}
	}, [projectId, filter]);

	if (loading) {
		return (
			<Card>
				<CardContent className="p-6">
					<div className="flex items-center justify-center">
						<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
						<span className="ml-2">Loading analytics...</span>
					</div>
				</CardContent>
			</Card>
		);
	}

	if (error) {
		return (
			<Card>
				<CardContent className="p-6">
					<p className="text-center text-red-600">Error: {error}</p>
				</CardContent>
			</Card>
		);
	}

	if (!project) {
		return (
			<Card>
				<CardContent className="p-6">
					<p className="text-center text-muted-foreground">Project not found</p>
				</CardContent>
			</Card>
		);
	}

	if (!metrics) {
		return (
			<Card>
				<CardContent className="p-6">
					<p className="text-center text-muted-foreground">No metrics available</p>
				</CardContent>
			</Card>
		);
	}

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold tracking-tight">{project.name}</h1>
					<p className="text-muted-foreground">{project.domain}</p>
				</div>
				<div className="flex items-center gap-2">
					<Badge variant={project.isActive ? 'default' : 'secondary'}>
						{project.isActive ? 'Active' : 'Inactive'}
					</Badge>
					{metrics.realtimeVisitors > 0 && (
						<Badge
							variant="outline"
							className="bg-green-50 text-green-700 border-green-200"
						>
							{metrics.realtimeVisitors} Active
						</Badge>
					)}
				</div>
			</div>
			<div className="space-y-6">
				<ClientAnalyticsOverview metrics={metrics} />
			</div>
		</div>
	);
}
