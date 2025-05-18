'use client';

import { getGithubCommits } from '@/api/queries/get-github-commits';
import { LogoIcon } from '@/components/core/logo';
import { Skeleton } from '@/shared/components/ui/skeleton';
import NumberFlow from '@number-flow/react';
import DottedMap from 'dotted-map';
import { motion } from 'framer-motion';
import { Activity, Map as MapIcon, MessageCircle } from 'lucide-react';
import { Suspense, useEffect, useState } from 'react';
import { Area, AreaChart, CartesianGrid } from 'recharts';
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from 'ui';
import { AnimatedNumbers } from './a';

const map = new DottedMap({ height: 55, grid: 'diagonal' });
const points = map.getPoints();
const svgOptions = {
	backgroundColor: 'var(--color-background)',
	color: 'currentColor',
	radius: 0.15,
};

const Map = () => {
	const viewBox = `0 0 120 60`;
	return (
		<svg viewBox={viewBox} style={{ background: svgOptions.backgroundColor }}>
			{points.map((point, index) => (
				<circle
					key={index}
					cx={point.x}
					cy={point.y}
					r={svgOptions.radius}
					fill={svgOptions.color}
				/>
			))}
		</svg>
	);
};

const chartConfig = {
	desktop: {
		label: 'Desktop',
		color: '#2563eb',
	},
	mobile: {
		label: 'Mobile',
		color: '#60a5fa',
	},
} satisfies ChartConfig;

const chartData = [
	{ month: 'May', desktop: 56, mobile: 224 },
	{ month: 'June', desktop: 56, mobile: 224 },
	{ month: 'January', desktop: 126, mobile: 252 },
	{ month: 'February', desktop: 205, mobile: 410 },
	{ month: 'March', desktop: 200, mobile: 126 },
	{ month: 'April', desktop: 400, mobile: 800 },
];

const MonitoringChart = () => {
	return (
		<ChartContainer className="h-120 aspect-auto md:h-96" config={chartConfig}>
			<AreaChart
				accessibilityLayer
				data={chartData}
				margin={{
					left: 0,
					right: 0,
				}}
			>
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
};

const fadeInUp = {
	initial: { opacity: 0, y: 20 },
	animate: { opacity: 1, y: 0 },
	transition: { duration: 0.5 }
};

export function FeaturesClient({ commitCount }: { commitCount: number }) {
	const formatRepoName = (name: string) => name.replace(/-/g, ' ● ');
	const [repoName, setRepoName] = useState('architecture-ryoa');
	const [commits, setCommits] = useState<any[]>([]);
	const [currentBranch, setCurrentBranch] = useState('main');
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const [commitResult, branchResult] = await Promise.all([
					getGithubCommits(),
					fetch('https://api.github.com/repos/remcostoeten/architecture-ryoa/branches').then(res => res.json())
				]);
				setCommits(commitResult || []);
				if (Array.isArray(branchResult)) {
					const defaultBranch = branchResult.find((branch: { name: string }) => branch.name === 'main');
					setCurrentBranch(defaultBranch?.name || 'main');
				}
				setLoading(false);
			} catch (error) {
				console.error('Error fetching data:', error);
				setLoading(false);
			}
		};

		fetchData();
	}, []);

	const lastPushTime = commits[0]?.commit?.author?.date
		? new Date(commits[0].commit.author.date)
		: null;

	const timeSinceLastPush = lastPushTime
		? Math.floor((new Date().getTime() - lastPushTime.getTime()) / (1000 * 60 * 60))
		: null;

	const contributorsSet = new Set(commits.map(commit => commit.author?.login).filter(Boolean));
	const contributorsCount = contributorsSet.size;

	return (
		<motion.section
			className="px-4 py-16 md:py-32"
			initial="initial"
			animate="animate"
			variants={fadeInUp}
		>
			<div className="mx-auto max-w-5xl border">
				<div className="flex flex-col lg:flex-row w-full">
					<div className="flex-1">
						<div className="p-6 sm:p-12">
							<motion.span
								className="text-muted-foreground flex items-center gap-2"
								variants={fadeInUp}
								transition={{ delay: 0.2 }}
							>
								<MapIcon className="size-4" />
								Real time location tracking
							</motion.span>

							<motion.p
								className="mt-8 text-2xl font-semibold"
								variants={fadeInUp}
								transition={{ delay: 0.3 }}
							>
								Advanced tracking system, Instantly locate all your assets.
							</motion.p>
						</div>

						<div aria-hidden className="relative">
							<div className="absolute inset-0 z-10 m-auto size-fit">
								<div className="rounded-(--radius) z-1 bg-muted relative flex size-fit w-fit items-center gap-2 border px-3 py-1 text-xs font-medium shadow-md shadow-zinc-950/5">
									<span className="text-lg">🇨🇩</span> Last connection from DR Congo
								</div>
								<div className="rounded-(--radius) absolute inset-2 -bottom-2 mx-auto border px-3 py-4 text-xs font-medium shadow-md shadow-zinc-950/5 bg-zinc-900"></div>
							</div>

							<div className="relative overflow-hidden">
								<div className="bg-radial z-1 to-background absolute inset-0 from-transparent to-75%"></div>
								<Map />
							</div>
						</div>
					</div>
					<div className="flex-1 overflow-hidden border-l p-6 sm:p-12 bg-transparent">
						<div className="relative z-10">
							<motion.span
								className="text-muted-foreground flex items-center gap-2"
								variants={fadeInUp}
								transition={{ delay: 0.4 }}
							>
								<MessageCircle className="size-4" />
								Email and web support
							</motion.span>

							<motion.p
								className="my-8 text-2xl font-semibold"
								variants={fadeInUp}
								transition={{ delay: 0.5 }}
							>
								Reach out via email or web for any assistance you need.
							</motion.p>
						</div>
						<div aria-hidden className="flex flex-col gap-8">
							<div>
								<div className="flex items-center gap-2">
									<span className="flex size-5 rounded-full border">
										<LogoIcon />
									</span>
									<span className="text-muted-foreground text-xs">Sat 22 Feb</span>
								</div>
								<div className="rounded-(--radius) bg-background mt-1.5 w-3/5 border p-3 text-xs">
									Hey, I'm having trouble with my account.
								</div>
							</div>

							<div>
								<div className="rounded-(--radius) mb-1 ml-auto w-3/5 bg-blue-600 p-3 text-xs text-white">
									Molestiae numquam debitis et ullam distinctio provident nobis
									repudiandae deleniti necessitatibus.
								</div>
								<span className="text-muted-foreground block text-right text-xs">
									Now
								</span>
							</div>
						</div>
					</div>
				</div>
				<div className="border-t border-gray-800 py-12 transition-all duration-300 hover:bg-gray-900/30">
					<motion.div
						className="flex flex-col items-center justify-center space-y-3 relative"
						variants={fadeInUp}
						transition={{ delay: 0.6 }}
					>
						<motion.h3
							className="text-sm font-medium uppercase tracking-wider text-gray-500 text-center w-full px-4"
							variants={fadeInUp}
							transition={{ delay: 0.7 }}
						>
							{formatRepoName(repoName)}
						</motion.h3>

						<div className="flex items-baseline justify-center w-full">
							<div className="flex items-baseline">
								<Suspense
									fallback={
										<div className="text-5xl font-light text-white">
											<Skeleton className="h-10 w-24" />
										</div>
									}
								>
									<AnimatedNumbers />
								</Suspense>
								<span className="ml-3 text-xl font-medium text-gray-400">Commits</span>
							</div>
						</div>

						<div className="flex items-center justify-center w-full space-x-8 text-xs text-gray-500">
							<div className="flex items-center">
								<span className="mr-1.5 h-1 w-1 rounded-full bg-gray-600"></span>
								<span className="flex items-center gap-1">
									Last push: {loading ? "Loading..." : timeSinceLastPush ? (
										<>
											<NumberFlow
												value={timeSinceLastPush}
												transformTiming={{ duration: 750, easing: 'ease-out' }}
												spinTiming={{ duration: 750, easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)' }}
												opacityTiming={{ duration: 350, easing: 'ease-out' }}
											/>
											<span>h ago</span>
										</>
									) : "N/A"}
								</span>
							</div>
							<div className="flex items-center">
								<span className="mr-1.5 h-1 w-1 rounded-full bg-gray-600"></span>
								<span className="flex items-center gap-1">
									{loading ? "Loading..." : (
										<>
											<NumberFlow
												value={contributorsCount}
												transformTiming={{ duration: 750, easing: 'ease-out' }}
												spinTiming={{ duration: 750, easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)' }}
												opacityTiming={{ duration: 350, easing: 'ease-out' }}
											/>
											<span>contributors</span>
										</>
									)}
								</span>
							</div>
						</div>

						<div className="absolute bottom-2 right-4 flex items-baseline opacity-60 hover:opacity-100 transition-opacity">
							<span className="text-sm font-mono text-gray-400">./</span>
							<span className="text-sm font-mono text-white">{currentBranch}</span>
						</div>

						<div className="mt-4 w-24 border-t border-gray-800" />
					</motion.div>
				</div>
				<div className="relative w-full">
					<motion.div
						className="absolute z-10 max-w-lg px-6 pr-12 pt-6 md:px-12 md:pt-12"
						variants={fadeInUp}
						transition={{ delay: 0.8 }}
					>
						<span className="text-muted-foreground flex items-center gap-2">
							<Activity className="size-4" />
							Activity feed
						</span>

						<motion.p
							className="my-8 text-2xl font-semibold"
							variants={fadeInUp}
							transition={{ delay: 0.9 }}
						>
							Monitor your application's activity in real-time.{' '}
							<span className="text-muted-foreground">
								{' '}
								Instantly identify and resolve issues.
							</span>
						</motion.p>
					</motion.div>
					<MonitoringChart />
				</div>
			</div>
		</motion.section>
	);
}
