'use client'

import { motion } from 'framer-motion'

type TProps = {
	className?: string
}

export function Logo({ className }: TProps) {
	return (
		<div className={className}>
			<svg
				viewBox="0 0 24 24"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
				className="w-full h-full"
			>
				<motion.path
					initial={{ pathLength: 0 }}
					animate={{ pathLength: 1 }}
					transition={{ duration: 1.5, ease: 'easeInOut' }}
					d="M12 2L2 7L12 12L22 7L12 2Z"
					stroke="currentColor"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
				<motion.path
					initial={{ pathLength: 0, opacity: 0 }}
					animate={{ pathLength: 1, opacity: 1 }}
					transition={{
						duration: 1.5,
						ease: 'easeInOut',
						delay: 0.5,
					}}
					d="M2 17L12 22L22 17"
					stroke="currentColor"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
				<motion.path
					initial={{ pathLength: 0, opacity: 0 }}
					animate={{ pathLength: 1, opacity: 1 }}
					transition={{
						duration: 1.5,
						ease: 'easeInOut',
						delay: 0.3,
					}}
					d="M2 12L12 17L22 12"
					stroke="currentColor"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
			</svg>
		</div>
	)
}
