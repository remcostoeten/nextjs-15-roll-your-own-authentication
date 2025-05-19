'use client';

import { memo } from 'react';
import { Area, AreaChart, CartesianGrid } from 'recharts';
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from 'ui';

type TChartData = {
	month: string;
	desktop: number;
	mobile: number;
};

const CHART_CONFIG = {
	desktop: { label: 'Desktop', color: '#2563eb' },
	mobile: { label: 'Mobile', color: '#60a5fa' },
} satisfies ChartConfig;

const CHART_DATA: TChartData[] = [
	{ month: 'May', desktop: 56, mobile: 224 },
	{ month: 'June', desktop: 56, mobile: 224 },
	{ month: 'January', desktop: 126, mobile: 252 },
	{ month: 'February', desktop: 205, mobile: 410 },
	{ month: 'March', desktop: 200, mobile: 126 },
	{ month: 'April', desktop: 400, mobile: 800 },
];

const GRADIENT_DEFS = (
	<defs>
		<linearGradient id="fillDesktop" x1="0" y1="0" x2="0" y2="1">
			<stop offset="0%" stopColor="var(--color-desktop)" stopOpacity={0.8} />
			<stop offset="55%" stopColor="var(--color-desktop)" stopOpacity={0.1} />
		</linearGradient>
		<linearGradient id="fillMobile" x1="0" y1="0" x2="0" y2="1">
			<stop offset="0%" stopColor="var(--color-mobile)" stopOpacity={0.8} />
			<stop offset="55%" stopColor="var(--color-mobile)" stopOpacity={0.1} />
		</linearGradient>
	</defs>
);

function MonitoringChartComponent() {
	return (
		<ChartContainer className="h-120 aspect-auto md:h-96" config={CHART_CONFIG}>
			<AreaChart
				accessibilityLayer
				data={CHART_DATA}
				margin={{ left: 0, right: 0 }}
			>
				{GRADIENT_DEFS}
				<CartesianGrid vertical={false} />
				<ChartTooltip
					active
					cursor={false}
					content={<ChartTooltipContent className="dark:bg-muted" />}
				/>
				<Area
					strokeWidth={2}
					dataKey="mobile"
					type="stepBefore"
					fill="url(#fillMobile)"
					fillOpacity={0.1}
					stroke="var(--color-mobile)"
					stackId="a"
				/>
				<Area
					strokeWidth={2}
					dataKey="desktop"
					type="stepBefore"
					fill="url(#fillDesktop)"
					fillOpacity={0.1}
					stroke="var(--color-desktop)"
					stackId="a"
				/>
			</AreaChart>
		</ChartContainer>
	);
}

export const MonitoringChart = memo(MonitoringChartComponent);
