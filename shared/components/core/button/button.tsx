'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/shared/helpers'
import { PurpleGlareEffect } from '@/shared/components/effects/purple-glare-effect'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: 'default' | 'outline' | 'ghost'
	size?: 'default' | 'sm' | 'lg'
	className?: string
	children: React.ReactNode
}

export function Button({
	variant = 'default',
	size = 'default',
	className,
	children,
	...props
}: ButtonProps) {
	const [isHovered, setIsHovered] = useState(false)

	const baseStyles = {
		default:
			'bg-[#0d0d0d] hover:bg-[#111316] border border-[#1a1d23] hover:border-[#252a33]',
		outline:
			'border border-input bg-transparent hover:bg-accent hover:text-accent-foreground',
		ghost: 'hover:bg-accent hover:text-accent-foreground',
	}

	const sizeStyles = {
		default: 'h-10 px-4 py-2',
		sm: 'h-9 px-3',
		lg: 'h-11 px-8',
	}

	return (
		<button
			className={cn(
				'relative overflow-hidden group transition-all duration-500 rounded-md text-sm font-medium',
				baseStyles[variant],
				sizeStyles[size],
				className
			)}
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
			{...props}
		>
			<PurpleGlareEffect isHovered={isHovered} />

			<span className="relative z-10">{children}</span>

			<motion.div
				initial={{ x: '-100%' }}
				whileHover={{ x: '0%' }}
				transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
				className="absolute inset-0 bg-gradient-to-r from-[#1a1d23]/0 via-[#252a33]/20 to-[#1a1d23]/0"
			/>
		</button>
	)
}
