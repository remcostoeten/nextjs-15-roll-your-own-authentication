'use client';

import { BlurIn } from '@/components/effects/blur-in';
import { GitHubStats } from '@/modules/landing/components/stats';
import Text from '@/shared/components/text';
import {
	type ChartConfig,
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from '@/shared/components/ui/charts';
import DottedMap from 'dotted-map';
import { motion } from 'framer-motion';
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
			<BlurIn delay={0.1}>
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
			</BlurIn>
		</div>
	);
}

export default function FeaturesSection() {
	const [commits, setCommits] = useState<TGitHubCommit[]>([]);

	useEffect(() => {
		const fetchCommits = async () => {
			const data = await getCommitDataClient();
			setCommits(data as unknown as TGitHubCommit[]);
		};
		fetchCommits();
	}, []);

	return (
		<motion.section
			className="mx-auto grid max-w-7xl relative"
			initial="hidden"
			animate="visible"
			variants={{
				hidden: {
					opacity: 0,
				},
				visible: {
					opacity: 1,
					transition: {
						staggerChildren: 0.2,
					},
				},
			}}
		>
			<motion.div
				className="absolute inset-0 border-t "
				variants={{
					hidden: { opacity: 0, width: 0 },
					visible: {
						opacity: 1,
						width: '100%',
						transition: {
							duration: 1,
							delay: 0.1,
						},
					},
				}}
			/>
			<motion.div
			/* needs to be refactored to psuedo elements so we can animate height */
				className="absolute pointer-events-none inset-0 border-l border-r border-red-500 z-10"
				variants={{
					hidden: { opacity: 0 },
					visible: {
						opacity: 1,
						transition: {
							duration: 0.8,
							delay: 0.3,
						},
					},
				}}
			/>
			<div className="grid md:grid-cols-2">
				<div>
					<BlurIn delay={0.2}>
						<div className="p-6 sm:p-12 space-y-6">
							<span className="text-muted-foreground flex items-center gap-2">
								<MapIcon className="size-4" size="xl" />
								<Text as="span"><i className='mr-[2px]'>R</i>oll your own analytics</Text>
							</span>
							<Text animate animationDelay={0.4} size="xl">
								Custom rolled analytics system with easy to integrate endpoints and
								full-fledged admin dashboard.
							</Text>
						</div>
					</BlurIn>

					<div aria-hidden className="relative overflow-hidden translate-y-[25px] ">
						<BlurIn delay={0.6}>
							<motion.div
								animate={{
									opacity: [0, 1],
								}}
								transition={{
									duration: 1,
									delay: 0.8,
								}}
								className="absolute inset-0 z-10 m-auto size-fit"
							>
								<div className="bg-background z-1 dark:bg-muted relative flex size-fit w-fit items-center gap-2 border px-3 py-1 text-xs font-medium shadow-md shadow-zinc-950/5">
									<Text as="span" className="text-lg">
										🇨🇩
									</Text>
									<Text as="span" animate animationDelay={0.7}>
										Last connection from DR Congo
									</Text>
								</div>
							</motion.div>
						</BlurIn>

						<BlurIn delay={0.8}>
							<motion.div
								className="relative overflow-hidden transX-y"
								animate={{
									opacity: [0, 1],
								}}
								transition={{
									duration: 1,
									delay: 0.8,
								}}
							>
								<div className="bg-radial z		-1 to-background absolute inset-0 from-transparent to-100% "/>
								<Map />
							</motion.div>
						</BlurIn>
					</div>
				</div>

				<div className="overflow-hidden border-t p-6 sm:p-12 md:border-0 md:border-l bg-transparent">
					<div className="relative z-10 space-y-6">
						<span className="text-muted-foreground flex items-center gap-2">
							<MessageCircle className="size-4" />
							<Text as="span" animate animationDelay={0.4}>
								Developer Support
							</Text>
						</span>

						<Text
							animate
							animationDelay={0.6}
							className="text-pretty hyphens-auto"
							size="xl"
						>
							Actually proper documentation unlike librarys deprecating or simply not
							documenting at all
						</Text>

						<div aria-hidden className="flex flex-col gap-8 pt-6">
							{/* First message group */}
							<BlurIn
								delay={0.7}
								variants={{
									hidden: { x: -20, opacity: 0 },
									show: {
										x: 0,
										opacity: 1,
										transition: { duration: 0.5 },
									},
									hover: { x: 4, transition: { duration: 0.2 } },
								}}
								whileHover="hover"
							>
								<div className="w-3/5">
									<time className="text-muted-foreground text-xs opacity-70">
										<Text animate animationDelay={0.7}>
											Sat 22 Feb
										</Text>
									</time>
									<motion.div className="mt-1.5 border p-3 text-xs bg-background/80 backdrop-blur-sm rounded-2xl rounded-tl-none shadow-lg">
										<Text animate animationDelay={0.8}>
											Hey, I'm having trouble with my account.
										</Text>
									</motion.div>
								</div>
							</BlurIn>

							{/* Second message group */}
							<BlurIn
								delay={0.9}
								variants={{
									hidden: { x: 20, opacity: 0 },
									show: {
										x: 0,
										opacity: 1,
										transition: { duration: 0.5 },
									},
									hover: { x: -4, transition: { duration: 0.2 } },
								}}
								whileHover="hover"
							>
								<div className="ml-auto w-3/5">
									<motion.div className="bg-primary/90 p-3 text-xs text-primary-foreground rounded-2xl rounded-tr-none shadow-lg backdrop-blur-sm">
										<Text animate animationDelay={1.0}>
											Our authentication system provides secure user
											management with complete customization options.
										</Text>
									</motion.div>
									<Text
										as={motion.span}
										animate
										animationDelay={1.1}
										className="block text-right text-muted-foreground text-xs opacity-70"
									>
										Now
									</Text>
								</div>
							</BlurIn>

							{/* Typing indicator */}
							<BlurIn
								delay={1.2}
								variants={{
									hidden: { opacity: 0, scale: 0.8 },
									show: {
										opacity: 1,
										scale: 1,
										transition: { duration: 0.3 },
									},
								}}
							>
								<div className="w-16">
									<motion.div
										className="flex gap-1.5 items-center"
										animate={{
											y: [0, -4, 0],
										}}
										transition={{
											repeat: Infinity,
											duration: 1.5,
											ease: 'easeInOut',
										}}
									>
										{[0, 1, 2].map((i) => (
											<motion.span
												key={i}
												className="w-2 h-2 bg-primary/50 rounded-full"
												animate={{
													y: [0, -4, 0],
												}}
												transition={{
													repeat: Infinity,
													duration: 1.5,
													delay: i * 0.15,
													ease: 'easeInOut',
												}}
											/>
										))}
									</motion.div>
								</div>
							</BlurIn>
						</div>
					</div>
				</div>
			</div>

			<motion.div
				initial={{ opacity: 0, y: 10 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5, ease: 'easeInOut' }}
			>
				<BlurIn delay={1.8}>
					<GitHubStats />
				</BlurIn>
			</motion.div>

			<motion.div
				initial={{ height: 0, opacity: 0 }}
				animate={{ height: '100%', opacity: 1 }}
				transition={{ duration: 0.5, ease: 'easeInOut' }}
				className="relative before:absolute before:top-0 before:left-0 before:right-0 before:h-px before:bg-border before:opacity-0 before:animate-in before:fade-in before:duration-600 before:delay-1000"
			>
				{/* Text content appears first */}
				<BlurIn delay={2.0}>
					<div className="absolute z-10 max-w-lg px-6 pr-12 pt-6 md:px-12 md:pt-12">
						<span className="text-muted-foreground flex items-center gap-2">
							<Activity className="size-4" />
							<Text as="span">Activity Feed</Text>
						</span>

						<Text
							animate
							animationDelay={2.2}
							size="2xl"
							className="font-semibold mt-6"
						>
							Monitor your application's activity in real-time.
							<Text as="span" className="text-muted-foreground">
								{' '}
								Instantly identify and resolve issues.
							</Text>
						</Text>
					</div>
				</BlurIn>

				{/* Chart appears last */}
				<BlurIn delay={2.4}>
					<MonitoringChart />
				</BlurIn>
			</motion.div>
		</motion.section>
	);
}

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
		color: 'hsl(var(--accent))',
	},
	mobile: {
		label: 'Mobile',
		color: 'hsl(var(--primary))',
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
	const [activeIndex, setActiveIndex] = useState<number | null>(null);

	const handleMouseEnter = (data: any, index: number) => {
		setActiveIndex(index);
	};

	const handleMouseLeave = () => {
		setActiveIndex(null);
	};

	return (
		<ChartContainer className="h-120 aspect-auto md:h-96" config={chartConfig}>
			<AreaChart
				accessibilityLayer
				data={chartData}
				margin={{
					left: 0,
					right: 0,
				}}
				onMouseMove={(data: any) => {
					if (data && data.activeTooltipIndex !== undefined) {
						handleMouseEnter(data, data.activeTooltipIndex);
					}
				}}
				onMouseLeave={handleMouseLeave}
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
					active={activeIndex !== null}
					cursor={{
						stroke: 'var(--color-desktop)',
						strokeWidth: 1,
						strokeDasharray: '5 5',
					}}
					content={<ChartTooltipContent className="dark:bg-muted" />}
				/>
				<Area
					strokeWidth={2}
					dataKey="mobile"
					type="monotone"
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
