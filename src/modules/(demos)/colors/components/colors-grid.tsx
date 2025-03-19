'use client'

import { motion } from 'framer-motion'
import { ColorCard } from './color-card'
import type { ColorVariable } from '@/modules/(demos)/colors/types'

type ColorsGridProps = {
	colors: ColorVariable[]
}

export function ColorsGrid({ colors }: ColorsGridProps) {
	return (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
			{colors.map((color, index) => (
				<motion.div
					key={color.name}
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.3, delay: index * 0.1 }}
				>
					<ColorCard
						name={color.name}
						value={color.value}
						classes={color.classes}
					/>
				</motion.div>
			))}
		</div>
	)
}
