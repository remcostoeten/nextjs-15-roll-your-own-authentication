'use client'

import { motion } from 'framer-motion'
import { cn } from 'helpers'

interface BentoCardProps {
	children: React.ReactNode
	size?: 'default' | 'large'
	gradient?: string
	className?: string
}

export function BentoCard({
	children,
	size = 'default',
	gradient,
	className
}: BentoCardProps) {
	return (
		<motion.div
			className={cn(
				'relative rounded-xl overflow-hidden group transition-all duration-300',
				size === 'large' ? 'md:col-span-2' : '',
				className
			)}
			initial={{ opacity: 0, y: 20 }}
			whileInView={{ opacity: 1, y: 0 }}
			whileHover={{ scale: 1.02 }}
			viewport={{ once: true }}
			transition={{ duration: 0.3 }}
		>
			<div className="absolute inset-0 bg-gradient-to-br from-background/95 to-background/50 backdrop-blur-md" />
			<div
				className="absolute inset-0 bg-gradient-to-br from-primary/5 via-accent/5 to-background/5 
                group-hover:from-primary/10 group-hover:via-accent/10 group-hover:to-background/10 
                transition-all duration-300"
			/>
			{gradient && (
				<div
					className={cn(
						'absolute inset-0 bg-gradient-to-br opacity-20 group-hover:opacity-30 transition-opacity duration-300',
						gradient
					)}
				/>
			)}
			<div
				className="absolute inset-px rounded-[11px] bg-gradient-to-br from-primary/20 via-accent/20 to-transparent 
                opacity-50 group-hover:opacity-70 group-hover:from-primary/30 group-hover:via-accent/30 
                transition-all duration-300"
			/>
			<motion.div
				className="relative p-6"
				whileHover={{ scale: 1.01 }}
				transition={{ duration: 0.2 }}
			>
				{children}
			</motion.div>
		</motion.div>
	)
}
