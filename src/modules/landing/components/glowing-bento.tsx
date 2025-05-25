import { DottedBackground } from '@/components/effects/dotted-bg';
import { GlowingEffect } from '@/components/effects/glowing-effect';
import { cn } from '@/shared/utilities';
import { Box, Lock, Search, Sparkles } from 'lucide-react';

import { Settings } from 'lucide-react';

export default function GlowingBento() {
	return (
			<section className="mx-auto  py-12 max-w-[1024px]">
				<ul className="grid grid-cols-1 grid-rows-none gap-4 md:grid-cols-12 md:grid-rows-3 lg:gap-4 xl:max-h-136 xl:grid-rows-2">
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
		<li className={cn('min-h-56 list-none group/bento', area)}>
			<div className="relative h-full rounded-none border  p-2 md:p-3">
				<GlowingEffect
					spread={40}
					glow={true}
					disabled={false}
					proximity={64}
					inactiveZone={0.01}
					borderWidth={3}
				/>
				<div className="relative flex h-full flex-col justify-between gap-6 overflow-hidden  border backdrop-blur-sm p-6 shadow-2xl">
					{/* Enhanced DottedBackground layer */}
					<div className="absolute inset-0 opacity-0 group-hover/bento:opacity-100 transition-all duration-700 ease-out">
						<DottedBackground
							dotColor="#3b82f6"
							dotSize={0.6}
							dotSpacing={18}
							enableVignette={false}
							enableInnerGlow={false}
							hoverColor="#3b82f6"
							hoverRadius={100}
							intensity={0.25}
							enableDepthEffect={true}
							enableSubtleAnimation={true}
							backgroundColor="transparent"
						/>
					</div>

					{/* Content */}
					<div className="relative z-10 flex flex-1 flex-col justify-between gap-3">
						<div className="w-fit rounded border border-gray-700  backdrop-blur-sm p-2 text-blue-400">
							{icon}
						</div>
						<div className="space-y-3">
							<h3 className="pt-0.5 text-xl leading-5.5 font-semibold font-sans tracking-[-0.04em] md:text-2xl md:leading-7.5 text-balance text-white">
								{title}
							</h3>
							<p className="font-sans text-sm leading-4.5 md:text-base md:leading-5.5 text-gray-400">
								{description}
							</p>
						</div>
					</div>
				</div>
			</div>
		</li>
	);
};
