'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { Spinner } from '@/shared/components/effects/spinner'
import { cn } from '@/shared/utils/helpers'
import Link from 'next/link'

export type ButtonVariant =
	| 'primary' // White background, black text
	| 'secondary' // Black background, white text
	| 'ghost' // Transparent background
	| 'sso' // Social sign-on style
	| 'link' // Appears as a link
	| 'danger' // Red variant for destructive actions

export type ButtonSize = 'sm' | 'md' | 'lg'

export interface CoreButtonProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: ButtonVariant
	size?: ButtonSize
	isLoading?: boolean
	loadingText?: string
	icon?: React.ReactNode
	iconPosition?: 'left' | 'right'
	href?: string
	fullWidth?: boolean
	className?: string
	children: React.ReactNode
}

const sizeClasses: Record<ButtonSize, string> = {
	sm: 'px-3 py-1.5 text-sm',
	md: 'px-4 py-2 text-base',
	lg: 'px-6 py-3 text-lg',
}

const variantClasses: Record<ButtonVariant, string> = {
	primary: 'bg-white text-black hover:bg-gray-100 disabled:bg-gray-200',
	secondary: 'bg-black text-white hover:bg-gray-900 border border-gray-800',
	ghost: 'bg-transparent text-white hover:bg-white/10',
	sso: 'bg-transparent text-white hover:bg-white/5 border border-neutral-800',
	link: 'bg-transparent text-white hover:underline p-0 h-auto',
	danger: 'bg-red-600 text-white hover:bg-red-700',
}

const baseClasses =
	'rounded-md font-medium transition-all duration-200 flex items-center justify-center disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none'

export const CoreButton = React.forwardRef<HTMLButtonElement, CoreButtonProps>(
	(
		{
			variant = 'primary',
			size = 'md',
			isLoading = false,
			loadingText,
			icon,
			iconPosition = 'left',
			href,
			fullWidth = false,
			className,
			children,
			disabled,
			...props
		},
		ref
	) => {
		const buttonClasses = cn(
			baseClasses,
			sizeClasses[size],
			variantClasses[variant],
			fullWidth ? 'w-full' : '',
			className
		)

		const content = (
			<>
				{isLoading ? (
					<span className="flex items-center justify-center">
						<Spinner
							size={
								size === 'sm'
									? 'sm'
									: size === 'lg'
										? 'lg'
										: 'md'
							}
							color={variant === 'primary' ? 'black' : 'white'}
							className="mr-2"
						/>
						<span>{loadingText || children}</span>
					</span>
				) : (
					<span className="flex items-center justify-center">
						{icon && iconPosition === 'left' && (
							<span className="mr-2">{icon}</span>
						)}
						<span>{children}</span>
						{icon && iconPosition === 'right' && (
							<span className="ml-2">{icon}</span>
						)}
					</span>
				)}
			</>
		)

		if (href && !disabled && !isLoading) {
			return (
				<Link
					href={href}
					className={buttonClasses}
				>
					{content}
				</Link>
			)
		}

		return (
			<motion.button
				ref={ref}
				className={buttonClasses}
				disabled={disabled || isLoading}
				{...props}
			>
				{content}
			</motion.button>
		)
	}
)

CoreButton.displayName = 'CoreButton'
