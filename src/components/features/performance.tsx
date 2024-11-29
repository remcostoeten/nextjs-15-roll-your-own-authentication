'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

export default function Performance() {
	const ref = useRef<HTMLDivElement>(null) as React.RefObject<HTMLDivElement>
	const isInView = useInView(ref, { once: true })

	const metrics = [
		{ label: 'Response Time', value: '120ms' },
		{ label: 'CPU Usage', value: '2.4%' },
		{ label: 'Memory', value: '45MB' }
	]

	return (
		<div ref={ref} className="h-full flex flex-col justify-center">
			{metrics.map((metric, i) => (
				<motion.div
					key={metric.label}
					className="flex justify-between items-center mb-4"
					initial={{ opacity: 0, x: -20 }}
					animate={isInView ? { opacity: 1, x: 0 } : {}}
					transition={{ delay: i * 0.2 }}
				>
					<span className="text-sm text-muted-foreground">
						{metric.label}
					</span>
					<span className="font-mono text-sm">{metric.value}</span>
				</motion.div>
			))}
		</div>
	)
}
