'use client'

import { motion, Variants } from 'framer-motion'
import { ReactNode } from 'react'

type FadeInProps = {
	children: ReactNode,
	delay: number,
	className?: string
}

export const FadeIn: React.FC<FadeInProps> = ({ children, delay, className }) => {
	const fadeIn: Variants = {
		initial: {
			opacity: 0
		},
		animate: {
			opacity: 1,
			transition: {
				duration: 0.5,
				ease: 'easeOut'
			}
		},
		exit: {
			opacity: 0,
			transition: {
				duration: 0.5,
				ease: 'easeIn'
			}
		}
	}

	return (
		<motion.div 
			variants={fadeIn}
			initial="initial"
			animate="animate"
			exit="exit"
			transition={{ delay }}
			className={className}
		>
			{children}
		</motion.div>
	)
}

export const FadeInUp: React.FC<FadeInProps> = ({ children, delay, className }) => {
	const fadeInUp: Variants = {
		initial: {
			opacity: 0,
			y: 20
		},
		animate: {
			opacity: 1,
			y: 0,
			transition: {
				duration: 0.5,
				ease: 'easeOut'
			}
		},
		exit: {
			opacity: 0,
			y: -20,
			transition: {
				duration: 0.5,
				ease: 'easeIn'
			}
		}
	}

	return (
		<motion.div 
			variants={fadeInUp}
			initial="initial"
			animate="animate"
			exit="exit"
			transition={{ delay }}
			className={className}
		>
			{children}
		</motion.div>
	)
}
