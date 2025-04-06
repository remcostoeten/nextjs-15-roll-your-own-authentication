'use client'
import {
	motion,
	AnimatePresence,
	useMotionValue,
	useTransform,
	type PanInfo,
} from 'framer-motion'
import {
	Check,
	AlertCircle,
	AlertTriangle,
	Info,
	Loader,
	RotateCcw,
	RefreshCw,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export type ToastVariant =
	| 'unsaved'
	| 'success'
	| 'error'
	| 'warning'
	| 'success-revert'
	| 'error-retry'
export type ToastPosition =
	| 'bottom'
	| 'bottom-right'
	| 'bottom-left'
	| 'top'
	| 'top-right'
	| 'top-left'

interface ToastProps {
	variant: ToastVariant
	message?: string
	onAction?: () => void
	onSecondaryAction?: () => void
	actionLabel?: string
	secondaryActionLabel?: string
	isLoading?: boolean
	position?: ToastPosition
	duration?: number
	onClose?: () => void
}

const toastConfig = {
	unsaved: {
		icon: (props: any) => (
			<Info
				className="w-[18px] h-[18px] text-white"
				{...props}
			/>
		),
		defaultMessage: 'Unsaved changes',
		actionLabel: 'Save',
		secondaryActionLabel: 'Reset',
		actionColor:
			'from-[#7c5aff] to-[#6c47ff] hover:from-[#8f71ff] hover:to-[#7c5aff] active:from-[#6c47ff] active:to-[#5835ff]',
		loadingMessage: 'Saving',
		successMessage: 'Changes Saved',
	},
	success: {
		icon: (props: any) => (
			<Check
				className="w-[18px] h-[18px] text-white"
				{...props}
			/>
		),
		defaultMessage: 'Success',
		iconWrapper: 'bg-emerald-500',
	},
	error: {
		icon: (props: any) => (
			<AlertCircle
				className="w-[18px] h-[18px] text-white"
				{...props}
			/>
		),
		defaultMessage: 'Error occurred',
		iconWrapper: 'bg-red-500',
	},
	warning: {
		icon: (props: any) => (
			<AlertTriangle
				className="w-[18px] h-[18px] text-white"
				{...props}
			/>
		),
		defaultMessage: 'Warning',
		iconWrapper: 'bg-amber-500',
	},
	'success-revert': {
		icon: (props: any) => (
			<Check
				className="w-[18px] h-[18px] text-white"
				{...props}
			/>
		),
		defaultMessage: 'Changes applied',
		actionLabel: 'Revert',
		iconWrapper: 'bg-emerald-500',
		actionColor:
			'from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 active:from-emerald-600 active:to-emerald-700',
	},
	'error-retry': {
		icon: (props: any) => (
			<AlertCircle
				className="w-[18px] h-[18px] text-white"
				{...props}
			/>
		),
		defaultMessage: 'Failed to complete',
		actionLabel: 'Retry',
		iconWrapper: 'bg-red-500',
		actionColor:
			'from-red-500 to-red-600 hover:from-red-400 hover:to-red-500 active:from-red-600 active:to-red-700',
	},
}

export function Toast({
	variant,
	message,
	onAction,
	onSecondaryAction,
	actionLabel,
	secondaryActionLabel,
	isLoading = false,
	position = 'bottom',
	duration,
	onClose,
}: ToastProps) {
	const config = toastConfig[variant]
	const [isVisible, setIsVisible] = useState(true)

	// Auto-close functionality with smooth animation
	useEffect(() => {
		if (duration && !isLoading) {
			const timer = setTimeout(() => {
				setIsVisible(false)
			}, duration)

			return () => clearTimeout(timer)
		}
	}, [duration, isLoading])

	// Handle final close after animation completes
	const handleAnimationComplete = () => {
		if (!isVisible && onClose) {
			onClose()
		}
	}

	const IconComponent = isLoading ? Loader : config.icon
	const iconProps = isLoading
		? { className: 'w-[18px] h-[18px] text-white animate-spin' }
		: {}

	const displayMessage =
		isLoading && config.loadingMessage
			? config.loadingMessage
			: message || config.defaultMessage

	const showActions =
		variant === 'unsaved' ||
		variant === 'success-revert' ||
		variant === 'error-retry'
	const showSecondaryAction = variant === 'unsaved'

	// Drag-to-dismiss functionality
	const x = useMotionValue(0)
	const y = useMotionValue(0)
	const opacity = useTransform(
		position.includes('bottom')
			? y
			: position.includes('top')
			? y.map((v) => -v)
			: x,
		[0, 100],
		[1, 0]
	)

	const getDragDirection = () => {
		switch (position) {
			case 'bottom':
				return { dragDirectionLock: 'y', dragElastic: 0.7 }
			case 'bottom-right':
				return { dragDirectionLock: false, dragElastic: 0.7 }
			case 'bottom-left':
				return { dragDirectionLock: false, dragElastic: 0.7 }
			case 'top':
				return { dragDirectionLock: 'y', dragElastic: 0.7 }
			case 'top-right':
				return { dragDirectionLock: false, dragElastic: 0.7 }
			case 'top-left':
				return { dragDirectionLock: false, dragElastic: 0.7 }
			default:
				return { dragDirectionLock: 'y', dragElastic: 0.7 }
		}
	}

	const handleDragEnd = (_: any, info: PanInfo) => {
		const threshold = 80

		// Determine if we should dismiss based on position and drag direction
		let shouldDismiss = false

		if (position.includes('bottom')) {
			shouldDismiss =
				info.offset.y > threshold ||
				(position !== 'bottom' && Math.abs(info.offset.x) > threshold)
		} else if (position.includes('top')) {
			shouldDismiss =
				info.offset.y < -threshold ||
				(position !== 'top' && Math.abs(info.offset.x) > threshold)
		} else {
			shouldDismiss =
				Math.abs(info.offset.x) > threshold ||
				Math.abs(info.offset.y) > threshold
		}

		if (shouldDismiss) {
			setIsVisible(false)
		}
	}

	const { dragDirectionLock, dragElastic } = getDragDirection()

	// Enhanced icon animation variants
	const iconVariants = {
		initial: {
			opacity: 0,
			scale: 0.5,
			rotate: -10,
		},
		animate: {
			opacity: 1,
			scale: 1,
			rotate: 0,
			transition: {
				type: 'spring',
				stiffness: 500,
				damping: 15,
				delay: 0.05,
			},
		},
		exit: {
			opacity: 0,
			scale: 0.5,
			rotate: 10,
			transition: {
				duration: 0.2,
				ease: 'easeOut',
			},
		},
	}

	return (
		<AnimatePresence onExitComplete={handleAnimationComplete}>
			{isVisible && (
				<motion.div
					initial={{ opacity: 0, y: 20, scale: 0.9 }}
					animate={{ opacity: 1, y: 0, scale: 1 }}
					exit={{
						opacity: 0,
						y: position.includes('top') ? -20 : 20,
						scale: 0.9,
						transition: { duration: 0.3, ease: [0.32, 0.72, 0, 1] },
					}}
					transition={{
						duration: 0.4,
						ease: [0.16, 1, 0.3, 1],
					}}
					drag={true}
					dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
					dragDirectionLock={dragDirectionLock}
					dragElastic={dragElastic}
					onDragEnd={handleDragEnd}
					style={{ x, y, opacity }}
					className="cursor-grab active:cursor-grabbing"
				>
					<Card className="inline-flex h-10 items-center justify-center gap-4 px-1 py-0 bg-[#131316] rounded-[99px] overflow-hidden shadow-[0px_32px_64px_-16px_#0000004c,0px_16px_32px_-8px_#0000004c,0px_8px_16px_-4px_#0000003d,0px_4px_8px_-2px_#0000003d,0px_-8px_16px_-1px_#00000029,0px_2px_4px_-1px_#0000003d,0px_0px_0px_1px_#000000,inset_0px_0px_0px_1px_#ffffff14,inset_0px_1px_0px_#ffffff33] border-none">
						<CardContent className="flex items-center p-0">
							<motion.div
								className="inline-flex items-center justify-center gap-2 pl-1.5 pr-3 py-0"
								layout
								transition={{
									duration: 0.25,
									ease: 'easeInOut',
								}}
							>
								<AnimatePresence mode="wait">
									<motion.div
										key={`${variant}-${isLoading}`}
										variants={iconVariants}
										initial="initial"
										animate="animate"
										exit="exit"
										className={cn(
											'flex items-center justify-center',
											config.iconWrapper &&
												!isLoading &&
												'p-0.5 rounded-full w-[22px] h-[22px]'
										)}
									>
										<IconComponent {...iconProps} />
									</motion.div>
								</AnimatePresence>
								<AnimatePresence mode="wait">
									<motion.span
										key={displayMessage}
										className="text-white text-[13px] leading-5 font-normal whitespace-nowrap"
										initial={{ opacity: 0, x: -5 }}
										animate={{ opacity: 1, x: 0 }}
										exit={{ opacity: 0, x: 5 }}
										transition={{
											duration: 0.2,
											delay: 0.1,
										}}
									>
										{displayMessage}
									</motion.span>
								</AnimatePresence>
							</motion.div>

							<AnimatePresence>
								{showActions && !isLoading && (
									<motion.div
										className="inline-flex items-center gap-2 pl-0 pr-px py-0"
										initial={{ opacity: 0, width: 0 }}
										animate={{ opacity: 1, width: 'auto' }}
										exit={{ opacity: 0, width: 0 }}
										transition={{
											duration: 0.25,
											ease: 'easeInOut',
											delay: 0.15,
										}}
									>
										{showSecondaryAction && (
											<Button
												variant="ghost"
												className="h-7 px-3 text-[13px] text-white hover:bg-white/10 hover:text-white rounded-[99px] transition-colors duration-200"
												onClick={onSecondaryAction}
											>
												{secondaryActionLabel ||
													config.secondaryActionLabel}
											</Button>
										)}
										<Button
											variant="default"
											onClick={onAction}
											className={cn(
												'h-7 px-3 py-0 rounded-[99px] text-[13px] font-medium text-white bg-gradient-to-b shadow-[inset_0px_1px_0px_0px_rgba(255,255,255,0.2)] transition-all duration-200',
												config.actionColor ||
													'from-[#7c5aff] to-[#6c47ff] hover:from-[#8f71ff] hover:to-[#7c5aff] active:from-[#6c47ff] active:to-[#5835ff]'
											)}
										>
											{variant === 'success-revert' && (
												<RotateCcw className="mr-1 h-3 w-3" />
											)}
											{variant === 'error-retry' && (
												<RefreshCw className="mr-1 h-3 w-3" />
											)}
											{actionLabel || config.actionLabel}
										</Button>
									</motion.div>
								)}
							</AnimatePresence>
						</CardContent>
					</Card>
				</motion.div>
			)}
		</AnimatePresence>
	)
}
