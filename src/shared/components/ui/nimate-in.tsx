/**
 * @author Remco Stoeten
 * @description Reusable animation component for text or elements with blur/fade effects
 */

'use client'

import { motion } from 'framer-motion'
import { type ReactNode } from 'react'

type AnimateInProps = {
	children?: ReactNode
	className?: string
	words?: string
	animation?: 'blur' | 'fade' | 'both'
	delay?: number
	duration?: number
}

export default function AnimateIn({
	children,
	className,
	words,
	animation = 'both',
	delay = 0,
	duration = 1
}: AnimateInProps) {
	const variants = {
		blur: {
			hidden: { filter: 'blur(10px)', opacity: 0 },
			visible: { filter: 'blur(0px)', opacity: 1 }
		},
		fade: {
			hidden: { opacity: 0 },
			visible: { opacity: 1 }
		},
		both: {
			hidden: { filter: 'blur(10px)', opacity: 0 },
			visible: { filter: 'blur(0px)', opacity: 1 }
		}
	}

	if (words) {
		return (
			<div className={className}>
				{words.split(' ').map((word, i) => (
					<motion.span
						key={i}
						initial="hidden"
						animate="visible"
						variants={variants[animation]}
						transition={{
							duration,
							delay: delay + i * 0.1
						}}
						style={{
							display: 'inline-block',
							marginRight: '0.25em'
						}}
					>
						{word}
					</motion.span>
				))}
			</div>
		)
	}

	return (
		<motion.div
			initial="hidden"
			animate="visible"
			variants={variants[animation]}
			transition={{
				duration,
				delay
			}}
			className={className}
		>
			{children}
		</motion.div>
	)
}

/**
 * @usage
 * ** Text animation: <AnimateIn words="Welcome" animation="blur" />
 * ** Component animation: <AnimateIn animation="fade"><Card>Content</Card></AnimateIn>
 */
