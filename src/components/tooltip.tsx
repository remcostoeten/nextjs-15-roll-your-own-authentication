'use client'

/**
 * @file Tooltip.tsx
 * @description A highly customizable, accessible tooltip component with modern styling
 * @version 1.3.0
 * @author Remco Stoeten @remcostoeten
 * @license MIT
 */

import {
	AlertCircle,
	AlertTriangle,
	HelpCircle,
	Info,
	LucideIcon
} from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * Duration constants for animations in milliseconds
 * @readonly
 */
const DURATIONS = {
	FAST: 150,
	DEFAULT: 200,
	SLOW: 300
} as const

/** Minimum distance from viewport edges */
const BUFFER_SIZE = 10

/** Base z-index for tooltips */
const Z_INDEX = 50

/** Valid positions for the tooltip */
type Position = 'top' | 'bottom' | 'left' | 'right'

/** Available animation types */
type AnimationType = 'fade' | 'scale' | 'slide' | 'pop'

/** Variant styles for the tooltip */
type VariantType = 'default' | 'dark' | 'info' | 'success' | 'warning' | 'error'

/** Available icon types */
type IconType = 'info' | 'success' | 'warning' | 'error' | 'help'

/** Border style variants */
type BorderVariant = 'none' | 'light' | 'normal' | 'strong'

/** Pointer style variants */
type PointerStyle = 'none' | 'triangle' | 'caret' | 'arrow'

/** Optional keyboard shortcut to display */
type KbdStyle = {
	background?: string
	text?: string
	border?: string
	padding?: string
	fontSize?: string
	shadow?: string
}

/**
 * Tooltip component props interface with strict typing
 * @interface
 * @extends {React.HTMLAttributes<HTMLDivElement>}
 */
interface TooltipProps
	extends Omit<React.HTMLAttributes<HTMLDivElement>, 'content'> {
	/** The element that triggers the tooltip */
	children: React.ReactNode
	/** Content to display in the tooltip. Can be string or React node */
	content: string | React.ReactNode
	/** Position of the tooltip relative to the trigger element */
	position?: Position
	/** Animation style for showing/hiding the tooltip */
	animation?: AnimationType
	/** Visual style variant of the tooltip */
	variant?: VariantType
	/** Icon to display in the tooltip */
	icon?: IconType
	/** Size of the icon in pixels */
	iconSize?: number
	/** Whether to show the pointing arrow */
	showArrow?: boolean
	/** Additional CSS classes for the tooltip container */
	className?: string
	/** CSS classes for the outer container */
	containerClassName?: string
	/** CSS classes for the content wrapper */
	contentClassName?: string
	/** Delay before showing tooltip (ms) */
	delayShow?: number
	/** Delay before hiding tooltip (ms) */
	delayHide?: number
	/** Custom ID for the tooltip */
	id?: string
	/** ARIA role for the tooltip */
	role?: string
	/** ARIA label for the tooltip */
	ariaLabel?: string
	/** Whether the tooltip is disabled */
	isDisabled?: boolean
	/** ARIA label for the trigger element */
	triggerAriaLabel?: string
	/** Border style variant */
	borderVariant?: BorderVariant
	/** Callback when tooltip shows */
	onShow?: () => void
	/** Callback when tooltip hides */
	onHide?: () => void
	/** Style of the pointer indicator */
	pointerStyle?: PointerStyle
	/** Whether to show the pointer indicator */
	showPointer?: boolean
	/** Size of the pointer in pixels */
	pointerSize?: number
	/** Optional keyboard shortcut to display */
	shortcutKey?: string
	/** Custom styling for the keyboard shortcut display */
	kbdStyle?: KbdStyle
	/** Whether to show the keyboard shortcut */
	showKbd?: boolean
}

/**
 * Helper function to concatenate class names
 * @param classes - Array of potential class names
 * @returns Concatenated class names string
 */
const classNames = (
	...classes: (string | undefined | null | false)[]
): string => {
	return classes.filter(Boolean).join(' ')
}

/** Animation configurations */
const ANIMATIONS: Readonly<
	Record<AnimationType, { enter: string; from: string; to: string }>
> = {
	fade: {
		enter: `transition-opacity duration-${DURATIONS.DEFAULT} ease-in-out`,
		from: 'opacity-0',
		to: 'opacity-100'
	},
	scale: {
		enter: `transition-all duration-${DURATIONS.DEFAULT} ease-in-out`,
		from: 'opacity-0 scale-95',
		to: 'opacity-100 scale-100'
	},
	slide: {
		enter: `transition-all duration-${DURATIONS.DEFAULT} ease-in-out`,
		from: 'opacity-0 -translate-y-2',
		to: 'opacity-100 translate-y-0'
	},
	pop: {
		enter: `transition-all duration-${DURATIONS.FAST} ease-out`,
		from: 'opacity-0 scale-90',
		to: 'opacity-100 scale-100'
	}
} as const

/** Border style configurations */
const BORDER_VARIANTS: Readonly<
	Record<BorderVariant, Record<VariantType, string>>
> = {
	none: {
		default: '',
		dark: '',
		info: '',
		success: '',
		warning: '',
		error: ''
	},
	light: {
		default: 'border border-zinc-800/50',
		dark: 'border border-zinc-300/20',
		info: 'border border-blue-800/50',
		success: 'border border-green-800/50',
		warning: 'border border-amber-800/50',
		error: 'border border-red-800/50'
	},
	normal: {
		default: 'border border-zinc-700',
		dark: 'border border-zinc-600',
		info: 'border border-blue-700',
		success: 'border border-green-700',
		warning: 'border border-amber-700',
		error: 'border border-red-700'
	},
	strong: {
		default: 'border-2 border-zinc-600',
		dark: 'border-2 border-zinc-500',
		info: 'border-2 border-blue-600',
		success: 'border-2 border-green-600',
		warning: 'border-2 border-amber-600',
		error: 'border-2 border-red-600'
	}
} as const

/** Variant style configurations */
const VARIANTS: Readonly<
	Record<VariantType, { container: string; arrow: string }>
> = {
	default: {
		container: 'bg-white/95 text-zinc-800 shadow-lg shadow-black/10',
		arrow: 'before:bg-white/95 before:shadow-lg'
	},
	dark: {
		container: 'bg-zinc-900/95 text-zinc-100 shadow-lg shadow-black/20',
		arrow: 'before:bg-zinc-900/95 before:shadow-lg'
	},
	info: {
		container: 'bg-blue-950/95 text-blue-100',
		arrow: 'bg-blue-950/95'
	},
	success: {
		container: 'bg-green-950/95 text-green-100',
		arrow: 'bg-green-950/95'
	},
	warning: {
		container: 'bg-amber-950/95 text-amber-100',
		arrow: 'bg-amber-950/95'
	},
	error: {
		container: 'bg-red-950/95 text-red-100',
		arrow: 'bg-red-950/95'
	}
} as const

/** Icon mapping configuration */
const ICON_MAP: Readonly<Record<IconType, LucideIcon>> = {
	info: Info,
	success: Info,
	warning: AlertTriangle,
	error: AlertCircle,
	help: HelpCircle
} as const

/** Position opposite mapping */
const POSITION_OPPOSITES: Readonly<Record<Position, Position>> = {
	top: 'bottom',
	bottom: 'top',
	left: 'right',
	right: 'left'
} as const

/** Pointer style configurations */
const POINTER_STYLES: Readonly<Record<PointerStyle, string>> = {
	none: '',
	triangle:
		'before:content-[""] before:absolute before:w-0 before:h-0 before:border-8 before:border-transparent',
	caret: 'before:content-[""] before:absolute before:w-3 before:h-3 before:rotate-45',
	arrow: 'before:content-[""] before:absolute before:w-2 before:h-2 before:rotate-45 before:border before:border-white/10'
}

/** Default keyboard shortcut styles */
const DEFAULT_KBD_STYLES: KbdStyle = {
	background: 'bg-white/5',
	text: 'text-[#999999]',
	border: 'border border-white/10',
	padding: 'px-1.5 py-0.5',
	fontSize: 'text-xs',
	shadow: 'shadow-sm'
}

/**
 * Modern, accessible tooltip component with customizable styling and positioning
 * @component
 *
 * @example
 * ```tsx
 * <Tooltip
 *   content="Helpful information"
 *   position="top"
 *   variant="info"
 *   borderVariant="normal"
 * >
 *   <button>Hover me</button>
 * </Tooltip>
 * ```
 */
const Tooltip = ({
	children,
	content,
	position = 'top',
	animation = 'scale',
	variant = 'default',
	icon,
	iconSize = 16,
	showArrow = true,
	className = '',
	containerClassName = '',
	contentClassName = '',
	delayShow = 0,
	delayHide = 0,
	id,
	role = 'tooltip',
	ariaLabel,
	isDisabled = false,
	triggerAriaLabel,
	borderVariant = 'normal',
	onShow,
	onHide,
	pointerStyle = 'arrow',
	showPointer = true,
	pointerSize = 8,
	shortcutKey,
	kbdStyle = DEFAULT_KBD_STYLES,
	showKbd = true,
	...props
}: TooltipProps): JSX.Element => {
	const [isVisible, setIsVisible] = useState<boolean>(false)
	const [adjustedPosition, setAdjustedPosition] = useState<Position>(position)
	const tooltipRef = useRef<HTMLDivElement | null>(null)
	const containerRef = useRef<HTMLDivElement | null>(null)
	const timeoutRef = useRef<NodeJS.Timeout | null>(null)

	// Generate stable ID using index in parent component
	const tooltipId = id || 'tooltip'

	const checkAndAdjustPosition = useCallback((): void => {
		if (!tooltipRef.current || !containerRef.current) return

		const tooltipRect = tooltipRef.current.getBoundingClientRect()
		const viewportWidth = window.innerWidth
		const viewportHeight = window.innerHeight

		const needsAdjustment: Record<Position, boolean> = {
			top: tooltipRect.top < BUFFER_SIZE,
			bottom: tooltipRect.bottom > viewportHeight - BUFFER_SIZE,
			left: tooltipRect.left < BUFFER_SIZE,
			right: tooltipRect.right > viewportWidth - BUFFER_SIZE
		}

		if (needsAdjustment[position]) {
			setAdjustedPosition(POSITION_OPPOSITES[position])
		} else {
			setAdjustedPosition(position)
		}
	}, [position])

	const handleShow = (): void => {
		if (isDisabled) return
		if (timeoutRef.current) clearTimeout(timeoutRef.current)
		timeoutRef.current = setTimeout(() => {
			setIsVisible(true)
			checkAndAdjustPosition()
			onShow?.()
		}, delayShow)
	}

	const handleHide = (): void => {
		if (timeoutRef.current) clearTimeout(timeoutRef.current)
		timeoutRef.current = setTimeout(() => {
			setIsVisible(false)
			setAdjustedPosition(position)
			onHide?.()
		}, delayHide)
	}

	useEffect(() => {
		if (isVisible) {
			const handleResize = checkAndAdjustPosition
			const handleScroll = checkAndAdjustPosition

			window.addEventListener('resize', handleResize)
			window.addEventListener('scroll', handleScroll)

			return () => {
				window.removeEventListener('resize', handleResize)
				window.removeEventListener('scroll', handleScroll)
			}
		}
	}, [isVisible, position, checkAndAdjustPosition])

	useEffect(() => {
		return () => {
			if (timeoutRef.current) clearTimeout(timeoutRef.current)
		}
	}, [])

	const baseTooltipClasses = `absolute p-2 rounded-lg text-sm font-medium z-${Z_INDEX} shadow-xl backdrop-blur-sm`

	const positionClasses: Readonly<Record<Position, string>> = {
		top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
		bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
		left: 'right-full top-1/2 -translate-y-1/2 mr-2',
		right: 'left-full top-1/2 -translate-y-1/2 ml-2'
	}

	const arrowClasses: Readonly<Record<Position | 'base', string>> = {
		base: `absolute w-2 h-2 rotate-45 before:content-[''] before:absolute before:w-3 before:h-3 before:rotate-45 before:border before:border-white/10`,
		top: '-bottom-1 left-1/2 -translate-x-1/2',
		bottom: '-top-1 left-1/2 -translate-x-1/2',
		left: '-right-1 top-1/2 -translate-y-1/2',
		right: '-left-1 top-1/2 -translate-y-1/2'
	}

	const IconComponent = icon ? ICON_MAP[icon] : null

	const getPointerClasses = (pos: Position): string => {
		const baseClasses = `absolute ${POINTER_STYLES[pointerStyle]}`

		const positionMap: Record<Position, string> = {
			top: 'bottom-[-4px] left-1/2 -translate-x-1/2 before:border-t-current before:border-l-current',
			bottom: 'top-[-4px] left-1/2 -translate-x-1/2 before:border-b-current before:border-r-current',
			left: 'right-[-4px] top-1/2 -translate-y-1/2 before:border-l-current before:border-t-current',
			right: 'left-[-4px] top-1/2 -translate-y-1/2 before:border-r-current before:border-b-current'
		}

		return `${baseClasses} ${positionMap[pos]}`
	}

	return (
		<div
			ref={containerRef}
			className={classNames('relative inline-block', containerClassName)}
			onMouseEnter={handleShow}
			onMouseLeave={handleHide}
			onFocus={handleShow}
			onBlur={handleHide}
			aria-describedby={tooltipId}
			{...props}
		>
			<div
				role="tooltip-trigger"
				aria-label={triggerAriaLabel}
				className="inline-block"
			>
				{children}
			</div>
			<div
				ref={tooltipRef}
				id={tooltipId}
				role={role}
				aria-label={ariaLabel}
				className={classNames(
					baseTooltipClasses,
					positionClasses[adjustedPosition],
					VARIANTS[variant].container,
					BORDER_VARIANTS[borderVariant][variant],
					ANIMATIONS[animation].enter,
					isVisible
						? ANIMATIONS[animation].to
						: ANIMATIONS[animation].from,
					className
				)}
				style={{
					visibility: isVisible ? 'visible' : 'hidden'
				}}
			>
				{showPointer && (
					<div
						className={classNames(
							getPointerClasses(adjustedPosition),
							VARIANTS[variant].arrow
						)}
						style={{
							transform: `rotate(${
								adjustedPosition === 'top'
									? '180deg'
									: adjustedPosition === 'left'
										? '90deg'
										: adjustedPosition === 'right'
											? '-90deg'
											: '0deg'
							})`
						}}
					/>
				)}
				<div
					className={classNames(
						'flex items-center gap-1.5',
						contentClassName
					)}
				>
					{IconComponent && (
						<IconComponent
							size={iconSize}
							className="shrink-0"
							aria-hidden="true"
						/>
					)}
					<span>{content}</span>
					{showKbd && shortcutKey && (
						<kbd
							className={classNames(
								'rounded inline-flex items-center justify-center',
								kbdStyle.background,
								kbdStyle.text,
								kbdStyle.border,
								kbdStyle.padding,
								kbdStyle.fontSize,
								kbdStyle.shadow
							)}
						>
							{shortcutKey}
						</kbd>
					)}
				</div>
			</div>
		</div>
	)
}

/**
 * A highly customizable tooltip component with modern styling and accessibility features.
 *
 * @component
 * @example
 * ```tsx
 * <Tooltip
 *   content="Helpful information"
 *   position="bottom"
 *   variant="dark"
 *   pointerStyle="arrow"
 *   animation="pop"
 * >
 *   <button>Hover me</button>
 * </Tooltip>
 * ```
 *
 * @packageDocumentation
 * @module Tooltip
 * @version 1.4.0
 * @author Remco Stoeten @remcostoeten
 * @license MIT
 */
export default Tooltip
