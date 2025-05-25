'use client';

import { Activity } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from 'ui';
import { getCommitDataClient } from './api/cache-services';

type CommitDataPoint = {
	date: string;
	commits: number;
};

const chartConfig: ChartConfig = {
	commits: {
		label: 'Commits',
		color: '#2563eb',
	},
};

export function ActivityChart() {
	const [data, setData] = useState<CommitDataPoint[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const loadData = async () => {
			try {
				const commitData = await getCommitDataClient();
				setData(commitData);
			} catch (error) {
				console.error('Error loading commit data:', error);
			} finally {
				setLoading(false);
			}
		};
		loadData();
	}, []);

	if (loading) {
		return (
			<section className="py-6">
				<div className="mb-3 flex items-center gap-2 text-muted-foreground">
					<Activity className="size-4" />
					<span>Loading GitHub activity...</span>
				</div>
			</section>
		);
	}

	return (
		<section className="py-6">
			<div className="mb-3 flex items-center gap-2 text-muted-foreground">
				<Activity className="size-4" />
				<span>GitHub: RYOA Activity</span>
			</div>
			<ChartContainer className="h-96" config={chartConfig}>
				<AreaChart data={data} margin={{ left: 0, right: 0 }}>
					<defs>
						<linearGradient id="fillCommits" x1="0" y1="0" x2="0" y2="1">
							<stop offset="0%" stopColor="var(--color-commits)" stopOpacity={0.8} />
							<stop offset="55%" stopColor="var(--color-commits)" stopOpacity={0.1} />
						</linearGradient>
					</defs>
					<CartesianGrid vertical={false} />
					<XAxis dataKey="date" />
					<YAxis />
					<ChartTooltip
						active
						cursor={false}
						content={<ChartTooltipContent className="dark:bg-muted" />}
					/>
					<Area
						strokeWidth={2}
						dataKey="commits"
						type="monotone"
						fill="url(#fillCommits)"
						fillOpacity={0.1}
						stroke="var(--color-commits)"
					/>
				</AreaChart>
			</ChartContainer>
		</section>
	);
}
