'use client'

import { useCursorGlow } from '@/hooks/use-cursor-glow'
import { cn } from '@/lib/utils'
import { ComponentType, forwardRef } from 'react'

type WithCursorGlowProps = {
	glowConfig?: Parameters<typeof useCursorGlow>[0]
	className?: string
	[key: string]: any
}

export function withCursorGlow<P extends object>(
	WrappedComponent: ComponentType<P>
) {
	return forwardRef<HTMLElement, P & WithCursorGlowProps>(
		({ glowConfig, className, ...props }, ref) => {
			const {
				ref: glowRef,
				glowStyles,
				wrapperStyles,
				isHovered
			} = useCursorGlow(glowConfig)

			return (
				<div
					ref={glowRef}
					className={cn('relative overflow-hidden', className)}
					style={wrapperStyles}
				>
					<div style={glowStyles} aria-hidden="true" />
					<WrappedComponent
						{...(props as P)}
						ref={ref}
						data-hovered={isHovered}
					/>
				</div>
			)
		}
	)
}
