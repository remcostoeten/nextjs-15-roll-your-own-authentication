'use client';

import type { TDashboardData } from '@/api/schemas/dashboard-schema';
import { getDashboardData } from '@/modules/dashboard/server/queries/get-dashboard-data';
import { ActivityChart } from '@/modules/dashboard/ui/activity-chart';
import { ActivityFeed } from '@/modules/dashboard/ui/activity-feed';
import { TopContributors } from '@/modules/dashboard/ui/top-contributors';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { BarChart2, FileText, TicketCheck, Users } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function DashboardPage() {
	const params = useParams();
	const workspaceId = params.workspaceId as string;
	const [data, setData] = useState<TDashboardData | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		async function fetchData() {
			try {
				const result = await getDashboardData(workspaceId);
				if (result.success) {
					setData(result.data as TDashboardData);
				} else {
					setError(result.error || 'Failed to load dashboard data');
				}
			} catch (err) {
				setError('Failed to load dashboard data');
				console.error(err);
			} finally {
				setIsLoading(false);
			}
		}

		if (workspaceId) {
			fetchData();
		} else {
			setError('No workspace selected');
			setIsLoading(false);
		}
	}, [workspaceId]);

	if (error) {
		return (
			<div className="flex h-[50vh] items-center justify-center">
				<div className="text-center">
					<h2 className="text-lg font-semibold text-destructive">Error</h2>
					<p className="text-muted-foreground">{error}</p>
				</div>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			{/* Stats Overview */}
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Total Notes</CardTitle>
						<FileText className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						{isLoading ? (
							<Skeleton className="h-8 w-20" />
						) : (
							<>
								<div className="text-2xl font-bold">{data?.stats.totalNotes}</div>
								<p className="text-xs text-muted-foreground">+10% from last month</p>
							</>
						)}
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Total Tickets</CardTitle>
						<TicketCheck className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						{isLoading ? (
							<Skeleton className="h-8 w-20" />
						) : (
							<>
								<div className="text-2xl font-bold">{data?.stats.totalTickets}</div>
								<p className="text-xs text-muted-foreground">+20% from last month</p>
							</>
						)}
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Active Users</CardTitle>
						<Users className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						{isLoading ? (
							<Skeleton className="h-8 w-20" />
						) : (
							<>
								<div className="text-2xl font-bold">{data?.stats.activeUsers}</div>
								<p className="text-xs text-muted-foreground">+2 new this month</p>
							</>
						)}
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Activity Rate</CardTitle>
						<BarChart2 className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						{isLoading ? (
							<Skeleton className="h-8 w-20" />
						) : (
							<>
								<div className="text-2xl font-bold">{data?.stats.activityRate}%</div>
								<p className="text-xs text-muted-foreground">+5% from last month</p>
							</>
						)}
					</CardContent>
				</Card>
			</div>

			{/* Activity Chart and Contributors */}
			<div className="grid gap-4 md:grid-cols-7">
				{isLoading ? (
					<>
						<div className="md:col-span-5">
							<Card>
								<CardHeader>
									<div className="flex items-center justify-between">
										<CardTitle>Activity</CardTitle>
										<Skeleton className="h-8 w-32" />
									</div>
								</CardHeader>
								<CardContent>
									<Skeleton className="h-[300px]" />
								</CardContent>
							</Card>
						</div>
						<div className="md:col-span-2">
							<Card>
								<CardHeader>
									<CardTitle>Top Contributors</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="space-y-4">
										{Array.from({ length: 3 }).map((_, i) => (
											<div key={i} className="flex items-center justify-between">
												<div className="flex items-center gap-3">
													<Skeleton className="h-8 w-8 rounded-full" />
													<Skeleton className="h-4 w-24" />
												</div>
												<Skeleton className="h-4 w-12" />
											</div>
										))}
									</div>
								</CardContent>
							</Card>
						</div>
					</>
				) : data ? (
					<>
						<ActivityChart data={data.activityData} />
						<div className="md:col-span-2">
							<TopContributors contributors={data.contributors} />
						</div>
					</>
				) : null}
			</div>

			{/* Activity Feed */}
			{isLoading ? (
				<Card>
					<CardHeader>
						<CardTitle>Recent Activity</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="space-y-4">
							{Array.from({ length: 5 }).map((_, i) => (
								<div key={i} className="flex items-start gap-4">
									<Skeleton className="h-9 w-9 rounded-full" />
									<div className="flex-1 space-y-2">
										<div className="flex items-center gap-2">
											<Skeleton className="h-4 w-24" />
											<Skeleton className="h-3 w-16" />
										</div>
										<Skeleton className="h-4 w-full" />
									</div>
									<Skeleton className="h-4 w-4" />
								</div>
							))}
						</div>
					</CardContent>
				</Card>
			) : data ? (
				<ActivityFeed items={data.activityFeed} workspaceId={workspaceId} />
			) : null}
		</div>
	);
}
