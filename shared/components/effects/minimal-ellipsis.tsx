'use client'

import { motion } from 'framer-motion'

export function MinimalEllipsis() {
	return (
		<span className="inline-flex overflow-hidden">
			{[0, 1, 2].map((index) => (
				<motion.span
					key={index}
					animate={{ opacity: [0.3, 1, 0.3] }}
					transition={{
						duration: 1.5,
						repeat: Number.POSITIVE_INFINITY,
						delay: index * 0.2,
						ease: 'easeInOut',
					}}
					className="mx-[0.5px]"
				>
					.
				</motion.span>
			))}
		</span>
	)
}
