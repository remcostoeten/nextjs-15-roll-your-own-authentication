'use client'

import { WorldMap } from '@/components/effects/world-map'
import { cn } from '@/shared/helpers'
import { motion } from 'framer-motion'
import {
	AlertTriangle,
	Fingerprint,
	Key,
	Lock,
	Shield,
	Zap
} from 'lucide-react'
import React from 'react'
import { BentoCard } from './bento-grid'
import { Biometric } from './biometric'
import FraudPrevention from './fraud-prevention'
import { MultiFactor } from './multi-factor'
import { ZeroDeps } from './zero-deps'

const features = [
	{
		title: 'Multi-Factor Auth',
		description:
			'Secure authentication with support for multiple 2FA methods',
		icon: Key,
		component: MultiFactor,
		size: 'small' as const,
		gradient: 'from-purple-500/20 via-pink-500/10 to-transparent'
	},
	{
		title: 'Global Activity',
		description:
			'Real-time user activity and authentication events worldwide',
		icon: Shield,
		component: () => (
			<WorldMap
				dots={[
					{
						start: { lat: 40.7128, lng: -74.006 }, // New York
						end: { lat: 51.5074, lng: -0.1278 } // London
					},
					{
						start: { lat: 35.6762, lng: 139.6503 }, // Tokyo
						end: { lat: -33.8688, lng: 151.2093 } // Sydney
					}
				]}
				lineColor="#0ea5e9"
			/>
		),
		size: 'large' as const,
		gradient: 'from-blue-500/20 via-indigo-500/10 to-transparent'
	},
	{
		title: 'Fraud Prevention',
		description: 'Advanced fraud detection and prevention system',
		icon: AlertTriangle,
		component: FraudPrevention,
		size: 'small' as const,
		gradient: 'from-red-500/20 via-orange-500/10 to-transparent'
	},
	{
		title: 'Biometric Auth',
		description: 'Native biometric authentication support',
		icon: Fingerprint,
		component: Biometric,
		size: 'small' as const,
		gradient: 'from-cyan-500/20 via-blue-500/10 to-transparent'
	},
	{
		title: 'Zero Dependencies',
		description: 'Lightweight implementation with no external dependencies',
		icon: Lock,
		component: ZeroDeps,
		size: 'small' as const,
		gradient: 'from-emerald-500/20 via-teal-500/10 to-transparent'
	},
	{
		title: 'High Performance',
		description: 'Optimized for speed and minimal overhead',
		icon: Zap,
		component: React.lazy(() => import('./performance')),
		size: 'small' as const,
		gradient: 'from-violet-500/20 via-purple-500/10 to-transparent'
	}
]

export function FeatureGrid() {
	return (
		<div className="relative grid grid-cols-1 md:grid-cols-6 gap-6 max-w-7xl mx-auto">
			<motion.div
				className="absolute inset-0 -z-10"
				animate={{
					background: [
						'radial-gradient(600px circle at 0% 0%, rgba(124, 58, 237, 0.1), transparent 40%)',
						'radial-gradient(600px circle at 100% 100%, rgba(124, 58, 237, 0.1), transparent 40%)',
						'radial-gradient(600px circle at 50% 50%, rgba(124, 58, 237, 0.1), transparent 40%)'
					]
				}}
				transition={{ duration: 10, repeat: Infinity }}
			/>

			{features.map((feature, i) => {
				const Icon = feature.icon
				const Component = feature.component

				return (
					<BentoCard
						key={feature.title}
						className={cn(
							'transition-all duration-300',
							i === 1 ? 'md:col-span-4' : 'md:col-span-2',
							i === 0 || i === 2 ? 'md:row-span-2' : ''
						)}
						gradient={feature.gradient}
					>
						<div className="h-full flex flex-col">
							<div className="mb-6 flex items-center gap-4">
								<div className="relative">
									<div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/20 to-primary/0 blur-xl" />
									<div className="relative rounded-xl p-3 bg-gradient-to-br from-primary/20 to-primary/5">
										<Icon className="h-6 w-6" />
									</div>
								</div>
								<h3 className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
									{feature.title}
								</h3>
							</div>
							<p className="mb-6 text-muted-foreground text-sm">
								{feature.description}
							</p>
							<div className="flex-1 relative rounded-xl overflow-hidden bg-gradient-to-br from-background/50 to-background/20 p-4">
								{typeof feature.component === 'function' ? <feature.component /> : feature.component}
							</div>
						</div>
					</BentoCard>
				)
			})}
		</div>
	)
}
