'use client'

import { motion, useInView } from 'framer-motion'
import { cn } from 'helpers'
import { Globe, Laptop, Shield, Smartphone } from 'lucide-react'
import { useRef } from 'react'

export function SessionManagement() {
	const ref = useRef<HTMLDivElement>(null) as React.RefObject<HTMLDivElement>
	const isInView = useInView(ref, { once: true })

	const devices = [
		{
			icon: <Laptop className="h-4 w-4 text-primary" />,
			name: 'MacBook Pro',
			location: 'San Francisco, CA',
			status: 'Current Session',
			statusClass: 'text-primary',
			bgClass: 'bg-primary/10',
			lastActive: 'Active now'
		},
		{
			icon: <Smartphone className="h-4 w-4 text-primary/80" />,
			name: 'iPhone 14 Pro',
			location: 'San Francisco, CA',
			status: 'Active',
			statusClass: 'text-primary/80',
			bgClass: 'bg-primary/5',
			lastActive: '2m ago'
		},
		{
			icon: <Globe className="h-4 w-4 text-destructive/80" />,
			name: 'Unknown Device',
			location: 'Moscow, Russia',
			status: 'Blocked',
			statusClass: 'text-destructive',
			bgClass: 'bg-destructive/10',
			lastActive: '1h ago'
		}
	]

	return (
		<div ref={ref} className="relative h-full">
			<div className="space-y-3">
				{devices.map((device, index) => (
					<motion.div
						key={device.name}
						className={cn(
							'relative rounded-lg transition-colors',
							device.bgClass
						)}
						initial={{ opacity: 0, x: -20 }}
						animate={isInView ? { opacity: 1, x: 0 } : {}}
						transition={{ duration: 0.3, delay: index * 0.1 }}
					>
						<motion.div
							className="absolute inset-0 rounded-lg bg-gradient-to-r from-primary/10 to-transparent"
							initial={{ scaleX: 0 }}
							animate={isInView ? { scaleX: 1 } : {}}
							transition={{
								duration: 0.8,
								delay: 0.2 + index * 0.1
							}}
							style={{ transformOrigin: 'left' }}
						/>
						<div className="relative p-3">
							<div className="flex items-center justify-between">
								<div className="flex items-center gap-3">
									<div className="p-1.5 rounded-md bg-background/50">
										{device.icon}
									</div>
									<div>
										<div className="flex items-center gap-2">
											<span className="text-sm font-medium">
												{device.name}
											</span>
											<span
												className={cn(
													'text-xs',
													device.statusClass
												)}
											>
												{device.status}
											</span>
										</div>
										<div className="flex items-center gap-2 text-xs text-muted-foreground">
											<span>{device.location}</span>
											<span>•</span>
											<span>{device.lastActive}</span>
										</div>
									</div>
								</div>
								<motion.button
									className="p-1.5 rounded-md hover:bg-background/50 text-muted-foreground hover:text-destructive transition-colors"
									whileHover={{ scale: 1.05 }}
									whileTap={{ scale: 0.95 }}
								>
									<Shield className="h-4 w-4" />
								</motion.button>
							</div>
						</div>
					</motion.div>
				))}
			</div>
		</div>
	)
}
