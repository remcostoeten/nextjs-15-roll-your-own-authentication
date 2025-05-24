'use client';

import { LogoIcon } from '@/shared/components/core/logo';
import { AnimatedContent, AnimatedText } from '@/shared/components/effects/animated-content';
import { Container } from '@/shared/components/ui/container';
import { Activity, Map as MapIcon, MessageCircle } from 'lucide-react';
import type { ReactNode } from 'react';
import { MonitoringChart } from './charts/monitoring-chart';
import { DottedMapVisual, LocationIndicator } from './map';
import { GitHubStats } from './stats';

type TFeatureSection = {
	icon: ReactNode;
	title: string;
	description: ReactNode;
	children: ReactNode;
	delay?: number;
};

function FeatureSection({ icon, title, description, children, delay = 0 }: TFeatureSection) {
	return (
		<div className="relative">
			<AnimatedText className="text-muted-foreground flex items-center gap-2" delay={delay}>
				{icon}
				{title}
			</AnimatedText>

			<AnimatedContent className="mt-8 text-2xl font-semibold" delay={delay + 0.1}>
				{description}
			</AnimatedContent>
			{children}
		</div>
	);
}

function SupportChat() {
	return (
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
					I'll help you resolve that issue right away.
				</div>
				<span className="text-muted-foreground block text-right text-xs">Now</span>
			</div>
		</div>
	);
}

export function Features() {
	return (
		<AnimatedContent className="relative overflow-hidden py-16 sm:py-24 lg:py-32">
			<Container>
				<div className="mx-auto max-w-5xl">
					{/* Map and Support sections */}
					<div className="flex flex-col lg:flex-row w-full">
						<div className="flex-1">
							<div className="p-6 sm:p-12">
								<FeatureSection
									icon={<MapIcon className="size-4" />}
									title="Real time location tracking"
									description="Advanced tracking system, Instantly locate all your assets."
									delay={0.2}
								>
									<div aria-hidden className="relative">
										<LocationIndicator />
										<DottedMapVisual />
									</div>
								</FeatureSection>
							</div>
						</div>

						<div className="flex-1 overflow-hidden border-l p-6 sm:p-12 bg-transparent">
							<FeatureSection
								icon={<MessageCircle className="size-4" />}
								title="Email and web support"
								description="Reach out via email or web for any assistance you need."
								delay={0.4}
							>
								<SupportChat />
							</FeatureSection>
						</div>
					</div>

					{/* GitHub Stats */}
					<GitHubStats />

					{/* Activity Chart */}
					<div className="relative w-full">
						<FeatureSection
							icon={<Activity className="size-4" />}
							title="Activity feed"
							description={
								<>
									Monitor your application's activity in real-time.{' '}
									<span className="text-muted-foreground">
										Instantly identify and resolve issues.
									</span>
								</>
							}
							delay={0.8}
						>
							<MonitoringChart />
						</FeatureSection>
					</div>
				</div>
			</Container>
		</AnimatedContent>
	);
}
