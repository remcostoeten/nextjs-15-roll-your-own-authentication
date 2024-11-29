'use client'

import { motion, useInView } from 'framer-motion'
import { cn } from 'helpers'
import { Package } from 'lucide-react'
import { useRef } from 'react'

export function ZeroDeps() {
	const ref = useRef<HTMLDivElement>(null) as React.RefObject<HTMLDivElement>
	const isInView = useInView(ref, { once: true })

	const dependencies = [
		{ name: 'auth-library', size: '150kb' },
		{ name: '@jwt-auth/next', size: '0kb' }
	]

	return (
		<div ref={ref} className="relative h-full flex flex-col">
			<div className="flex-1 space-y-4">
				{dependencies.map((dep, index) => (
					<motion.div
						key={dep.name}
						className="relative rounded-lg bg-white/5 p-4"
						initial={{ opacity: 0, x: -20 }}
						animate={isInView ? { opacity: 1, x: 0 } : {}}
						transition={{ delay: index * 0.2 }}
					>
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-3">
								<Package className="h-4 w-4 text-muted-foreground" />
								<span className="font-mono text-sm">
									{dep.name}
								</span>
							</div>
							<motion.span
								className={cn(
									'text-sm font-mono',
									dep.size === '0kb'
										? 'text-primary'
										: 'text-destructive'
								)}
								initial={{ opacity: 0 }}
								animate={isInView ? { opacity: 1 } : {}}
								transition={{ delay: 0.5 + index * 0.2 }}
							>
								{dep.size}
							</motion.span>
						</div>
						{index === 0 && (
							<motion.div
								className="mt-2 h-1 w-full bg-destructive/20 rounded-full overflow-hidden"
								initial={{ opacity: 0 }}
								animate={isInView ? { opacity: 1 } : {}}
								transition={{ delay: 0.7 }}
							>
								<motion.div
									className="h-full bg-destructive"
									initial={{ width: '0%' }}
									animate={isInView ? { width: '100%' } : {}}
									transition={{ duration: 1, delay: 0.8 }}
								/>
							</motion.div>
						)}
					</motion.div>
				))}
			</div>
			<motion.div
				className="mt-4 text-center font-mono text-xs text-muted-foreground"
				initial={{ opacity: 0 }}
				animate={isInView ? { opacity: 1 } : {}}
				transition={{ delay: 1.2 }}
			>
				No external dependencies required
			</motion.div>
		</div>
	)
}
