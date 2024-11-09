'use client'

import {
	Badge,
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle
} from '@/shared/components/ui'
import { format, formatDistanceToNow } from 'date-fns'
import { motion } from 'framer-motion'
import { Clock, Info, Shield } from 'lucide-react'
import { useEffect, useState } from 'react'

// Types
interface SessionInfo {
	userId: string
	email: string
	sessionId: string
	createdAt: string
	expiresAt: string
	lastUsed: string
	userAgent?: string
	ipAddress?: string
}

interface SessionStatus {
	isAuthenticated: boolean
	sessionInfo?: SessionInfo
}

// Animation Constants
const ANIMATIONS = {
	pulse: {
		scale: [1, 1.2, 1],
		opacity: [0.6, 0.8, 0.6],
		transition: {
			duration: 2,
			repeat: Infinity,
			ease: 'easeInOut'
		}
	},
	ripple: {
		scale: [1, 2],
		opacity: [0.5, 0],
		transition: {
			duration: 1.5,
			repeat: Infinity,
			ease: 'easeOut'
		}
	},
	popover: {
		hidden: {
			opacity: 0,
			y: 10,
			scale: 0.95,
			transition: {
				type: 'spring',
				stiffness: 500,
				damping: 30
			}
		},
		visible: {
			opacity: 1,
			y: 0,
			scale: 1,
			transition: {
				type: 'spring',
				stiffness: 500,
				damping: 30
			}
		}
	}
}

export function AuthStatusIndicator() {
	const [showPopover, setShowPopover] = useState(false)
	const [status, setStatus] = useState<SessionStatus>({
		isAuthenticated: false
	})

	useEffect(() => {
		async function fetchSessionStatus() {
			try {
				const response = await fetch('/api/auth/session')
				const data = await response.json()
				setStatus(data)
			} catch (error) {
				console.error('Failed to fetch session status:', error)
				setStatus({ isAuthenticated: false })
			}
		}

		fetchSessionStatus()
		const interval = setInterval(fetchSessionStatus, 30000) // Update every 30 seconds
		return () => clearInterval(interval)
	}, [])

	// Environment variable check
	if (process.env.NEXT_PUBLIC_SHOW_AUTH_INDICATOR !== 'true') {
		return null
	}

	const indicatorColor = status.isAuthenticated
		? 'rgb(34, 197, 94)'
		: 'rgb(239, 68, 68)'
	const statusText = status.isAuthenticated
		? 'Authenticated'
		: 'Not Authenticated'

	function InfoRow({ label, value }: { label: string; value: string }) {
		return (
			<div className="flex justify-between items-center py-1">
				<span className="text-sm text-muted-foreground">{label}</span>
				<span
					className="text-sm font-medium truncate ml-2 max-w-[200px]"
					title={value}
				>
					{value}
				</span>
			</div>
		)
	}

	return (
		<div className="fixed bottom-6 right-6 z-50">
			<motion.div
				className="relative cursor-pointer"
				onMouseEnter={() => setShowPopover(true)}
				onMouseLeave={() => setShowPopover(false)}
				initial="initial"
				animate="pulse"
				variants={ANIMATIONS.pulse}
			>
				{/* Ripple Effect */}
				<motion.div
					className="absolute inset-0 rounded-full"
					style={{ backgroundColor: indicatorColor }}
					variants={ANIMATIONS.ripple}
					animate="scale"
				/>

				{/* Core Indicator */}
				<motion.div
					className="relative w-3 h-3 rounded-full"
					style={{ backgroundColor: indicatorColor }}
					whileHover={{ scale: 1.2 }}
				/>

				{/* Info Popover */}
				<motion.div
					className="absolute bottom-full right-0 mb-2"
					initial="hidden"
					animate={showPopover ? 'visible' : 'hidden'}
					variants={ANIMATIONS.popover}
				>
					<Card className="w-80 shadow-lg">
						<CardHeader className="pb-2">
							<div className="flex items-center justify-between">
								<CardTitle className="text-lg font-semibold flex items-center gap-2">
									<Shield className="w-4 h-4" />
									Authentication Status
								</CardTitle>
								<Badge
									variant={
										status.isAuthenticated
											? 'success'
											: 'destructive'
									}
									className="ml-2"
								>
									{statusText}
								</Badge>
							</div>
							<CardDescription>
								Session information and details
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-4">
							{status.isAuthenticated && status.sessionInfo ? (
								<>
									<div className="space-y-2">
										<InfoRow
											label="User ID"
											value={status.sessionInfo.userId}
										/>
										<InfoRow
											label="Email"
											value={status.sessionInfo.email}
										/>
										<InfoRow
											label="Session ID"
											value={status.sessionInfo.sessionId}
										/>
									</div>
									<div className="space-y-2">
										<div className="flex items-center gap-2 text-sm text-muted-foreground">
											<Clock className="w-4 h-4" />
											Time Information
										</div>
										<InfoRow
											label="Created"
											value={format(
												new Date(
													status.sessionInfo.createdAt
												),
												'PPpp'
											)}
										/>
										<InfoRow
											label="Expires"
											value={formatDistanceToNow(
												new Date(
													status.sessionInfo.expiresAt
												),
												{ addSuffix: true }
											)}
										/>
										<InfoRow
											label="Last Activity"
											value={formatDistanceToNow(
												new Date(
													status.sessionInfo.lastUsed
												),
												{ addSuffix: true }
											)}
										/>
									</div>
									{(status.sessionInfo.userAgent ||
										status.sessionInfo.ipAddress) && (
										<div className="space-y-2">
											<div className="flex items-center gap-2 text-sm text-muted-foreground">
												<Info className="w-4 h-4" />
												Additional Details
											</div>
											{status.sessionInfo.userAgent && (
												<InfoRow
													label="User Agent"
													value={
														status.sessionInfo
															.userAgent
													}
												/>
											)}
											{status.sessionInfo.ipAddress && (
												<InfoRow
													label="IP Address"
													value={
														status.sessionInfo
															.ipAddress
													}
												/>
											)}
										</div>
									)}
								</>
							) : (
								<div className="text-sm text-muted-foreground text-center py-2">
									No active session information available
								</div>
							)}
						</CardContent>
					</Card>
				</motion.div>
			</motion.div>
		</div>
	)
}
