'use client';

import { GitHubStats } from '@/modules/landing/components/stats';
import Text from '@/shared/components/text';
import {
	type ChartConfig,
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from '@/shared/components/ui/charts';
import DottedMap from 'dotted-map';
import { Activity, GitCommit, Map as MapIcon, MessageCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Area, AreaChart, CartesianGrid } from 'recharts';
import { getCommitDataClient } from './api/cache-services';

type TGitHubCommit = {
	commit: {
		message: string;
		author: {
			name: string;
			date: string;
		};
	};
	author: {
		login: string;
	};
};

function CommitPopover({ commit }: { commit: TGitHubCommit }) {
	return (
		<div className="space-y-2">
			<div className="flex items-center gap-2 text-sm font-medium">
				<GitCommit className="h-4 w-4" />
				<Text as="span">Latest Commit</Text>
			</div>
			<div className="text-xs text-muted-foreground">
				<Text as="p" className="font-medium text-from">
					{commit.commit.message}
				</Text>
				<Text as="p" className="mt-1">
					by {commit.commit.author?.name || 'Unknown'}
				</Text>
				<Text as="p">
					{new Intl.DateTimeFormat('en-US', {
						weekday: 'long',
						year: 'numeric',
						month: 'long',
						day: 'numeric',
						hour: '2-digit',
						minute: '2-digit',
					}).format(new Date(commit.commit.author?.date))}
				</Text>
			</div>
		</div>
	);
}

export function FeaturesSection() {
	const [commits, setCommits] = useState<TGitHubCommit[]>([]);

	useEffect(() => {
		const fetchCommits = async () => {
			const data = await getCommitDataClient();
			setCommits(data as unknown as TGitHubCommit[]);
		};
		fetchCommits();
	}, []);

	return (
		<section className="mx-auto grid max-w-7xl relativ ">
			<div className="absolute inset-0 border-t pointer-events-none !border-l !border-r" />
		<div className="absolute pointer-events-none inset-0 border-l border-r z-10" />
		<div className="grid md:grid-cols-2 border-l border-r">
				<div>
					<div className="p-6 sm:p-12 space-y-6">
						<span className="text-muted-foreground flex items-center gap-2">
							<MapIcon className="size-4" size="xl" />
							<Text as="span">
								<i className='mr-[2px]'>R</i>oll your own analytics
							</Text>
						</span>
						<Text size="xl">
							Custom rolled analytics system with easy to integrate endpoints and
							full-fledged admin dashboard.
						</Text>
					</div>

					<div aria-hidden className="relative overflow-hidden translate-y-[25px] ">
						<div className="absolute inset-0 z-10 m-auto size-fit">
							<div className="bg-background z-1 dark:bg-muted relative flex size-fit w-fit items-center gap-2 border px-3 py-1 text-xs font-medium shadow-md shadow-zinc-950/5">
								<Text as="span" className="text-lg">
									🇨🇩
								</Text>
								<Text as="span">
									Last connection from DR Congo
								</Text>
							</div>
						</div>

						<div className="relative overflow-hidden transX-y">
							<div className="bg-radial z-1 to-background absolute inset-0 from-transparent to-100%" />
							<Map />
						</div>
					</div>
				</div>

				<div className="relative py-4 z-10 space-y-6">
					<div className="p-6 sm:p-12 space-y-6">	
						<span className="text-muted-foreground flex items-center gap-2">
						<MessageCircle className="size-4" />
						<Text as="span">
							Developer Support
						</Text>
					</span>

					<Text className="text-pretty hyphens-auto" size="xl">
						Get help from our team of developers and designers. We're here to help you
						build the best possible experience for your users.
					</Text>

					<div aria-hidden className="flex flex-col gap-8 pt-6">
						<div className="w-3/5">
							<time className="text-muted-foreground text-xs opacity-70">
								<Text>Sat 22 Feb</Text>
							</time>
							<div className="mt-1.5 border p-3 text-xs bg-background/80 backdrop-blur-sm rounded-2xl rounded-tl-none shadow-lg">
								<Text>
									Hey, I'm having trouble with my account.
								</Text>
							</div>
						</div>

						<div className="ml-auto w-3/5">
							<div className="bg-primary/90 p-3 text-xs text-primary-foreground rounded-2xl rounded-tr-none shadow-lg backdrop-blur-sm">
								<Text>
									Our authentication system provides secure user
									management with complete customization options.
								</Text>
							</div>
							<Text as="span" className="block text-right text-muted-foreground text-xs opacity-70">
								Now
							</Text>
						</div>
					</div>
					</div>
				</div>
			</div>

			<div>
				<GitHubStats />
			</div>

			<div className="relative border">
				<div className="absolute z-10 max-w-lg px-6 pr-12 pt-6 md:px-12 md:pt-12">
					<span className="text-muted-foreground flex items-center gap-2">
						<Activity className="size-4" />
						<Text as="span">Activity Feed</Text>
					</span>

					<Text size="2xl" className="font-semibold mt-6">
						Monitor your application's activity in real-time.
						<Text as="span" className="text-muted-foreground">
							{' '}
							Instantly identify and resolve issues.
						</Text>
					</Text>
				</div>

				<MonitoringChart />
			</div>
		</section>
	);
}

const map = new DottedMap({ height: 55, grid: 'diagonal' });
const points = map.getPoints();

const svgOptions = {
	backgroundColor: 'var(--color-background)',
	color: 'currentColor',
	radius: 0.15,
};

function Map() {
	return (
		<div
			className="h-full w-full"
			dangerouslySetInnerHTML={{
				__html: map.getSVG(svgOptions),
			}}
		/>
	);
}

const chartData = [
	{ month: 'January', desktop: 186, mobile: 80 },
	{ month: 'February', desktop: 305, mobile: 200 },
	{ month: 'March', desktop: 237, mobile: 120 },
	{ month: 'April', desktop: 73, mobile: 190 },
	{ month: 'May', desktop: 209, mobile: 130 },
	{ month: 'June', desktop: 214, mobile: 140 },
];

const chartConfig = {
	desktop: {
		label: 'Desktop',
		color: 'hsl(var(--chart-1))',
	},
	mobile: {
		label: 'Mobile',
		color: 'hsl(var(--chart-2))',
	},
} satisfies ChartConfig;

function MonitoringChart() {
	const [activeIndex, setActiveIndex] = useState<number | null>(null);

	const handleMouseEnter = (data: any, index: number) => {
		setActiveIndex(index);
	};

	const handleMouseLeave = () => {
		setActiveIndex(null);
	};

	return (
		<ChartContainer config={chartConfig} className="min-h-[200px] w-full">
			<AreaChart
				accessibilityLayer
				data={chartData}
				margin={{
					left: 12,
					right: 12,
				}}
				onMouseMove={handleMouseEnter}
				onMouseLeave={handleMouseLeave}
			>
				<CartesianGrid vertical={false} />
				<ChartTooltip
					cursor={false}
					content={<ChartTooltipContent indicator="dot" />}
				/>
				<Area
					dataKey="mobile"
					type="natural"
					fill="var(--color-mobile)"
					fillOpacity={0.4}
					stroke="var(--color-mobile)"
					stackId="a"
				/>
				<Area
					dataKey="desktop"
					type="natural"
					fill="var(--color-desktop)"
					fillOpacity={0.4}
					stroke="var(--color-desktop)"
					stackId="a"
				/>
			</AreaChart>
		</ChartContainer>
	);
}
``