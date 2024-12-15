'use client'

import { cn } from 'helpers'
import { motion, useInView, Variants } from 'framer-motion'
import * as React from 'react'

type WordsPullUpProps = {
	text: string
	className?: string
}

export const wordsPullUp: Variants = {
	initial: {
		y: 100,
		opacity: 0
	},
	animate: {
		y: 0,
		opacity: 1,
		transition: {
			duration: 0.8,
			ease: [0.2, 0.65, 0.3, 0.9]
		}
	},
	exit: {
		y: -100,
		opacity: 0,
		transition: {
			duration: 0.8,
			ease: [0.2, 0.65, 0.3, 0.9]
		}
	}
}

export default function WordsPullUp({
	text,
	className = ''
}: WordsPullUpProps) {
	const splittedText = text.split(' ')

	const ref = React.useRef(null)
	const isInView = useInView(ref, { once: true })

	return (
		<div className="flex justify-center">
			{splittedText.map((current, i) => (
				<motion.div
					key={i}
					ref={ref}
					variants={wordsPullUp}
					initial="initial"
					animate={isInView ? 'animate' : ''}
					custom={i}
					className={cn(
						'text-xl text-center sm:text-4xl font-bold tracking-tighter md:text-6xl md:leading-[4rem]',
						'pr-2',
						className
					)}
				>
					{current === '' ? <span>&nbsp;</span> : current}
				</motion.div>
			))}
		</div>
	)
}
