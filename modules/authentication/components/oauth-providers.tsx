'use client'

import type React from 'react'

import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Github, ChevronDown, ChevronUp } from 'lucide-react'
import { Button } from '@/components/ui/button'

type TProps = {
	showMoreProviders: boolean
	onToggleMoreProvidersAction: () => void
}

export function OAuthProviders({
	showMoreProviders,
	onToggleMoreProvidersAction,
}: TProps) {
	return (
		<div className="space-y-3">
			<OAuthButton
				provider="github"
				icon={<Github className="mr-2 h-4 w-4" />}
			>
				Github
			</OAuthButton>

			<OAuthButton
				provider="discord"
				icon={
					<svg
						className="mr-2 h-4 w-4"
						viewBox="0 0 24 24"
						fill="currentColor"
					>
						<path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
					</svg>
				}
			>
				Discord
			</OAuthButton>

			<div className="relative">
				<Button
					type="button"
					variant="outline"
					size="sm"
					className="w-full text-xs text-muted-foreground hover:text-foreground transition-colors border-[#1a1d23] hover:border-[#252a33]"
					onClick={onToggleMoreProvidersAction}
				>
					{showMoreProviders
						? 'Show less options'
						: 'Show more options'}
					{showMoreProviders ? (
						<ChevronUp className="ml-2 h-3 w-3" />
					) : (
						<ChevronDown className="ml-2 h-3 w-3" />
					)}
				</Button>
			</div>

			<AnimatePresence>
				{showMoreProviders && (
					<motion.div
						initial={{ height: 0, opacity: 0 }}
						animate={{ height: 'auto', opacity: 1 }}
						exit={{ height: 0, opacity: 0 }}
						transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
						className="space-y-3 overflow-hidden"
					>
						<OAuthButton
							provider="google"
							icon={
								<svg
									className="mr-2 h-4 w-4"
									viewBox="0 0 24 24"
								>
									<path
										d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
										fill="#4285F4"
									/>
									<path
										d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
										fill="#34A853"
									/>
									<path
										d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
										fill="#FBBC05"
									/>
									<path
										d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
										fill="#EA4335"
									/>
								</svg>
							}
						>
							Google{' '}
						</OAuthButton>

						<OAuthButton
							provider="outlook"
							icon={
								<svg
									className="mr-2 h-4 w-4"
									viewBox="0 0 24 24"
									fill="currentColor"
								>
									<path d="M7.88 12.04q0 .45-.11.87-.1.41-.33.74-.22.33-.58.52-.37.2-.87.2t-.85-.2q-.35-.21-.57-.55-.22-.33-.33-.75-.1-.42-.1-.86t.1-.87q.1-.43.34-.76.22-.34.59-.54.36-.2.87-.2t.86.2q.35.21.57.55.22.34.31.77.1.43.1.88zM24 12v9.38q0 .46-.33.8-.33.32-.8.32H7.13q-.46 0-.8-.33-.32-.33-.32-.8V18H1q-.41 0-.7-.3-.3-.29-.3-.7V7q0-.41.3-.7Q.58 6 1 6h6.5V2.55q0-.44.3-.75.3-.3.75-.3h12.9q.44 0 .75.3.3.3.3.75V10.85l1.24.72h.01q.1.07.18.18.07.12.07.25zm-6-8.25v3h3v-3zm0 4.5v3h3v-3zm0 4.5v1.83l3.05-1.83zm-5.25-9v3h3.75v-3zm0 4.5v3h3.75v-3zm0 4.5v2.03l2.41 1.5 1.34-.8v-2.73zM9 3.75V6h2l.13.01.12.04v-2.3zM5.98 15.98q.9 0 1.6-.3.7-.32 1.19-.86.48-.55.73-1.28.25-.74.25-1.61 0-.83-.25-1.55-.24-.71-.71-1.24t-1.15-.83q-.68-.3-1.55-.3-.92 0-1.64.3-.71.3-1.2.85-.5.54-.75 1.3-.25.74-.25 1.63 0 .85.26 1.56.26.72.74 1.23.48.52 1.17.81.69.3 1.56.3zM7.5 21h12.39L12 16.08V17q0 .41-.3.7-.29.3-.7.3H7.5zm15-.13v-7.24l-5.9 3.54Z" />
								</svg>
							}
						>
							Outlook
						</OAuthButton>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	)
}

interface OAuthButtonProps {
	children: React.ReactNode
	provider: string
	icon: React.ReactNode
}

function OAuthButton({ children, provider, icon }: OAuthButtonProps) {
	const [isHovering, setIsHovering] = useState(false)
	const buttonRef = useRef<HTMLButtonElement>(null)
	const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

	const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
		if (buttonRef.current) {
			const rect = buttonRef.current.getBoundingClientRect()
			setMousePosition({
				x: e.clientX - rect.left,
				y: e.clientY - rect.top,
			})
		}
	}

	return (
		<Button
			ref={buttonRef}
			type="button"
			variant="outline"
			className="w-full relative overflow-hidden group bg-[#0d0d0d] border-[#1a1d23] hover:border-[#252a33] hover:bg-[#111316] transition-all duration-500"
			onMouseEnter={() => setIsHovering(true)}
			onMouseLeave={() => setIsHovering(false)}
			onMouseMove={handleMouseMove}
		>
			{/* Content */}
			<span className="relative z-10 flex items-center">
				{icon}
				<span>{children}</span>
			</span>
			{/* Circuit pattern overlay */}
			<div className="absolute inset-0 overflow-hidden opacity-10"></div>
			<motion.div
				initial={{ opacity: 0 }}
				animate={{
					opacity: isHovering ? 0.15 : 0,
				}}
				transition={{ duration: 0.3 }}
				style={{
					background: `radial-gradient(circle 100px at ${mousePosition.x}px ${mousePosition.y}px, rgba(100, 120, 220, 0.8), transparent)`,
				}}
				className="absolute inset-0 z-0"
			/>
			{/* Animated lines */}
			<div className="absolute inset-0 overflow-hidden">
				<motion.div
					initial={{ x: '-100%' }}
					animate={{ x: isHovering ? '100%' : '-100%' }}
					transition={{
						duration: 1.5,
						ease: 'easeInOut',
						repeat: isHovering ? Number.POSITIVE_INFINITY : 0,
						repeatType: 'loop',
					}}
					className="absolute top-[20%] left-0 h-[1px] w-[30%] bg-gradient-to-r from-transparent via-[#4a88ff]/30 to-transparent"
				/>
				<motion.div
					initial={{ x: '100%' }}
					animate={{ x: isHovering ? '-100%' : '100%' }}
					transition={{
						duration: 2,
						ease: 'easeInOut',
						repeat: isHovering ? Number.POSITIVE_INFINITY : 0,
						repeatType: 'loop',
						delay: 0.2,
					}}
					className="absolute top-[40%] right-0 h-[1px] w-[20%] bg-gradient-to-r from-transparent via-[#4a88ff]/20 to-transparent"
				/>
				<motion.div
					initial={{ x: '-100%' }}
					animate={{ x: isHovering ? '100%' : '-100%' }}
					transition={{
						duration: 1.8,
						ease: 'easeInOut',
						repeat: isHovering ? Number.POSITIVE_INFINITY : 0,
						repeatType: 'loop',
						delay: 0.5,
					}}
					className="absolute top-[70%] left-0 h-[1px] w-[40%] bg-gradient-to-r from-transparent via-[#4a88ff]/25 to-transparent"
				/>
			</div>
			{/* Bottom line */}
			<motion.div
				initial={{ width: 0 }}
				animate={{ width: isHovering ? '100%' : 0 }}
				transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
				className="absolute bottom-0 left-0 h-[1px] bg-[#2a3141]"
			/>
		</Button>
	)
}
