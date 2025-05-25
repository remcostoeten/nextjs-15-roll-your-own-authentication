'use client';

import { GlowingEffect } from '@/components/effects/glowing-effect';
import { Box, Lock, Search, Settings, Sparkles } from 'lucide-react';
import { cn } from 'utilities';

export function GlowingBento() {
	return (
		<section className="mx-auto max-w-[1024px]">
			<ul className="grid grid-cols-1 grid-rows-none gap-4 md:grid-cols-12 md:grid-rows-3 lg:gap-4 xl:max-h-[34rem] xl:grid-rows-2">
				<GridItem
					area="md:[grid-area:1/1/2/7] xl:[grid-area:1/1/2/5]"
					icon={<Box className="h-4 w-4" />}
					title="Advanced tracking system"
					description="Instantly locate all your assets."
				/>
				<GridItem
					area="md:[grid-area:1/7/2/13] xl:[grid-area:2/1/3/5]"
					icon={<Settings className="h-4 w-4" />}
					title="Email and web support"
					description="Reach out via email or web for any assistance you need."
				/>
				<GridItem
					area="md:[grid-area:2/1/3/7] xl:[grid-area:1/5/3/8]"
					icon={<Lock className="h-4 w-4" />}
					title="Real-time monitoring"
					description="Monitor your application's activity in real-time. Instantly identify and resolve issues."
				/>
				<GridItem
					area="md:[grid-area:2/7/3/13] xl:[grid-area:1/8/2/13]"
					icon={<Sparkles className="h-4 w-4" />}
					title="Activity feed"
					description="Track all activities and changes in your system with detailed logs and notifications."
				/>
				<GridItem
					area="md:[grid-area:3/1/4/13] xl:[grid-area:2/8/3/13]"
					icon={<Search className="h-4 w-4" />}
					title="GitHub Integration"
					description="View commits, track changes, and monitor your repository's activity in real-time."
				/>
			</ul>
		</section>
	);
}

interface GridItemProps {
	area: string;
	icon: React.ReactNode;
	title: string;
	description: React.ReactNode;
}

const GridItem = ({ area, icon, title, description }: GridItemProps) => {
	return (
		<li className={cn('min-h-[14rem] list-none', area)}>
			<div className="relative h-full AAAAA border-[0.75px] border-border p-2 md:AAAAA md:p-3">
				<GlowingEffect
					spread={40}
					glow={true}
					disabled={false}
					proximity={64}
					inactiveZone={0.01}
					borderWidth={3}
				/>
				<div className="relative flex h-full flex-col justify-between gap-6 overflow-hidden AAAAA border-[0.75px] bg-background p-6 shadow-sm dark:shadow-[0px_0px_27px_0px_rgba(45,45,45,0.3)] md:p-6">
					<div className="relative flex flex-1 flex-col justify-between gap-3">
						<div className="w-fit AAAAA border-[0.75px] border-border bg-muted p-2">
							{icon}
						</div>
						<div className="space-y-3">
							<h3 className="pt-0.5 text-xl leading-[1.375rem] font-semibold font-sans tracking-[-0.04em] md:text-2xl md:leading-[1.875rem] text-balance text-foreground">
								{title}
							</h3>
							<h2 className="[&_b]:md:font-semibold [&_strong]:md:font-semibold font-sans text-sm leading-[1.125rem] md:text-base md:leading-[1.375rem] text-muted-foreground">
								{description}
							</h2>
						</div>
					</div>
				</div>
			</div>
		</li>
	);
};
