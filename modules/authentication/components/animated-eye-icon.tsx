'use client'

import { motion } from 'framer-motion'

type TProps = {
	isOpen: boolean
	className?: string
	activeColor?: string
	inactiveColor?: string
}

export function AnimatedEyeIcon({
	isOpen,
	className,
	activeColor = 'currentColor',
	inactiveColor = 'currentColor',
}: TProps) {
	return (
		<div className={className}>
			<svg
				width="20"
				height="20"
				viewBox="0 0 24 24"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
				className="relative"
			>
				{/* Eye shape */}
				<motion.path
					d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"
					stroke={isOpen ? activeColor : inactiveColor}
					strokeWidth="1.5"
					strokeLinecap="round"
					strokeLinejoin="round"
					fill="none"
					initial={false}
					animate={{ opacity: isOpen ? 1 : 0.4 }}
					transition={{ duration: 0.2 }}
				/>

				{/* Pupil */}
				<motion.circle
					cx="12"
					cy="12"
					r="3"
					stroke={isOpen ? activeColor : inactiveColor}
					fill="none"
					strokeWidth="1.5"
					strokeLinecap="round"
					strokeLinejoin="round"
					initial={false}
					animate={{
						opacity: isOpen ? 1 : 0,
						scale: isOpen ? 1 : 0.5,
					}}
					transition={{ duration: 0.2 }}
				/>

				{/* Slash line */}
				<motion.path
					d="M2 2l20 20"
					stroke={inactiveColor}
					strokeWidth="1.5"
					strokeLinecap="round"
					strokeLinejoin="round"
					initial={false}
					animate={{
						opacity: isOpen ? 0 : 1,
						pathLength: isOpen ? 0 : 1,
					}}
					transition={{ duration: 0.3 }}
				/>
			</svg>
		</div>
	)
}
