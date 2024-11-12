'use client'

import { useCursorGlow } from '@/hooks/use-cursor-glow'
import { cn } from '@/lib/utils'
import { type HTMLAttributes, forwardRef } from 'react'

type GlowCardProps = HTMLAttributes<HTMLDivElement> & {
	glowConfig?: Parameters<typeof useCursorGlow>[0]
}

export const GlowCard = forwardRef<HTMLDivElement, GlowCardProps>(
	({ className, children, glowConfig, ...props }, ref) => {
		const { elementRef, glowStyles, containerStyles } =
			useCursorGlow(glowConfig)

		return (
			<div
				ref={(el) => {
					elementRef.current = el
					if (typeof ref === 'function') ref(el)
					else if (ref) ref.current = el
				}}
				className={cn('relative overflow-hidden rounded-xl', className)}
				style={containerStyles}
				{...props}
			>
				<div style={glowStyles} aria-hidden="true" />
				{children}
			</div>
		)
	}
)

GlowCard.displayName = 'GlowCard'
