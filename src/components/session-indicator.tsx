'use client'

import { useState, useEffect } from 'react'
import { cn } from '@/shared/helpers/utils'
import { isFeatureEnabled, FeatureFlag } from '@/core/config/feature-flags'
import { useUser } from '@/contexts/user-context'

type Props = {
	className?: string
}

export default function SessionIndicator({ className }: Props) {
	const { user, isLoading } = useUser()
	const [isHovered, setIsHovered] = useState(false)
	const [mounted, setMounted] = useState(false)

	useEffect(() => {
		setMounted(true)
	}, [])

	if (!mounted || !isFeatureEnabled(FeatureFlag.SHOW_SESSION_INDICATOR)) {
		return null
	}

	const isAuthenticated = !!user && !isLoading

	return (
		<div
			className={cn(
				'fixed bottom-3 right-8 z-50',
				'transition-transform duration-1000 ease-in-out',
				isHovered ? 'scale-105' : '',
				className
			)}
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
		>
			<div className="relative">
				{/* Status Indicator */}
				<div
					className={cn(
						'h-2 w-2 rounded-full',
						'transition-all duration-1000 ease-in-out',
						'shadow-sm',
						isAuthenticated ? 'bg-green-500/30' : 'bg-red-500/30',
						{
							'scale-110 ring-1 ring-offset-1 ring-offset-background':
								isHovered,
							'ring-green-400/20': isAuthenticated && isHovered,
							'ring-red-400/20': !isAuthenticated && isHovered
						}
					)}
				>
					{/* Pulse Rings - Extra Slow and Subtle */}
					<div
						className={cn(
							'absolute -inset-1 rounded-full',
							'animate-[ping_8s_ease-in-out_infinite] opacity-60',
							isAuthenticated
								? 'bg-green-400/10'
								: 'bg-red-400/10'
						)}
					/>
					<div
						className={cn(
							'absolute -inset-2 rounded-full',
							'animate-[ping_12s_ease-in-out_infinite] opacity-60',
							isAuthenticated ? 'bg-green-400/5' : 'bg-red-400/5'
						)}
					/>
				</div>

				{/* Session Details Popup */}
				{isHovered && (
					<div
						className={cn(
							'absolute bottom-4 right-0',
							'w-64 p-3 rounded-lg',
							'bg-background/70 backdrop-blur-sm',
							'border border-border/30 shadow-lg',
							'animate-in fade-in-0 zoom-in-95 slide-in-from-bottom-2 duration-700',
							'text-xs'
						)}
					>
						<div className="space-y-2">
							<div className="flex items-center justify-between">
								<span className="font-medium text-muted-foreground">
									Session Status
								</span>
								<span
									className={cn(
										'px-1.5 py-0.5 rounded-full text-[10px] font-medium',
										isAuthenticated
											? 'bg-green-100/5 text-green-500/70'
											: 'bg-red-100/5 text-red-500/70'
									)}
								>
									{isAuthenticated ? 'Active' : 'Inactive'}
								</span>
							</div>

							{isAuthenticated && user ? (
								<div className="space-y-1.5 border-t border-border/30 pt-2">
									<div className="text-muted-foreground/60">
										{user.email && (
											<div className="flex justify-between items-center">
												<span className="text-[10px]">
													Email:
												</span>
												<span className="font-mono text-[10px] opacity-60">
													{user.email}
												</span>
											</div>
										)}
										{user.name && (
											<div className="flex justify-between items-center">
												<span className="text-[10px]">
													Name:
												</span>
												<span className="font-mono text-[10px] opacity-60">
													{user.name}
												</span>
											</div>
										)}
										{user.provider && (
											<div className="flex justify-between items-center">
												<span className="text-[10px]">
													Provider:
												</span>
												<span className="font-mono text-[10px] opacity-60">
													{user.provider}
												</span>
											</div>
										)}
									</div>
								</div>
							) : (
								<div className="text-muted-foreground/40 text-[10px]">
									No active session. Sign in to see session
									details.
								</div>
							)}
						</div>
					</div>
				)}
			</div>
		</div>
	)
}
