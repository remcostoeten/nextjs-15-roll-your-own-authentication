'use client'

import { useDismissedState } from '@/hooks/use-local-storage'
import { AnimatePresence, motion } from 'framer-motion'
import { cn } from 'helpers'
import { useEffect, useState } from 'react'

export const EMOJI_MAP = {
	rocket: '🚀',
	warning: '⚠️',
	info: 'ℹ️',
	success: '✅',
	error: '❌'
} as const

type Notice = {
	badgeText: string
	badgeEmoji: keyof typeof EMOJI_MAP
	message: string
}

type BannerProps = {
	notices: Notice[]
	animated?: boolean
	onClose?: () => void
	storageKey: string
	position?: 'top' | 'bottom'
	className?: string
}

export default function NotificationBar({
	notices,
	className,
	animated = false,
	storageKey,
	position = 'bottom'
}: BannerProps) {
	const [isDismissed, setDismissed] = useDismissedState(storageKey)
	const [isVisible, setIsVisible] = useState(!isDismissed)

	useEffect(() => {
		if (animated && !isDismissed) {
			setIsVisible(false)
			setTimeout(() => setIsVisible(true), 0)
		}
	}, [animated, isDismissed])

	const handleDismiss = () => {
		setDismissed()
		setIsVisible(false)
	}

	if (isDismissed) return null

	return (
		<AnimatePresence>
			{isVisible && (
				<section
					aria-label="Notifications alt+T"
					tabIndex={-1}
					aria-live="polite"
					aria-relevant="additions text"
					aria-atomic="false"
				>
					<motion.div
						initial={{
							opacity: 0,
							y: position === 'bottom' ? 20 : -20
						}}
						animate={{ opacity: 1, y: 0 }}
						exit={{
							opacity: 0,
							y: position === 'bottom' ? 20 : -20
						}}
						transition={{ duration: 0.2 }}
						className={cn(
							className,
							'fixed left-0 py-6 flex items-center backdrop-blur-xs right-0 dark:bg-black/50 backdrop-blur-sm border-[#969799] dark:border-white/10',
							position === 'bottom'
								? 'bottom-0 border-t'
								: 'top-0 border-b'
						)}
					>
						<div className="max-w-page-size mx-auto px-4 py-2">
							<div className="flex items-center justify-between">
								<div className="flex items-center space-x-4 max-w-page-size">
									{notices.map((notice, index) => (
										<div
											key={index}
											className="flex items-center space-x-4"
										>
											<span className="px-2 py-1 text-xs font-medium rounded-full bg-[#969799]/20 dark:bg-white/10 border border-[#969799]/30 dark:border-white/20">
												{EMOJI_MAP[notice.badgeEmoji]}{' '}
												{notice.badgeText}
											</span>
											<span className="text-sm text-[#000000] dark:text-neutral-300 text-center">
												{notice.message}
											</span>
										</div>
									))}
								</div>
								<button
									onClick={handleDismiss}
									className="p-1 hover:bg-[#969799]/20 dark:hover:bg-white/10 rounded-full transition-colors"
									aria-label="Dismiss notification"
								>
									<svg
										className="w-4 h-4 text-[#969799] dark:text-neutral-400"
										fill="none"
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth="2"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path d="M6 18L18 6M6 6l12 12" />
									</svg>
								</button>
							</div>
						</div>
					</motion.div>
				</section>
			)}
		</AnimatePresence>
	)
}
