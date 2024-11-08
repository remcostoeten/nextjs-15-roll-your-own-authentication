'use client'

import { motion, useSpring } from 'framer-motion'
import { Plus } from 'lucide-react'
import { type ReactNode, useEffect, useRef } from 'react'

type BackgroundSquareProps = {
	size?: 'sm' | 'md' | 'lg'
	position: { top: number; left: number; rotate: number }
	index: number
}

type FloatingCardProps = {
	children: ReactNode
	delay: number
	offset: { x: number; y: number; rotate: number }
}

type BadgeProps = {
	left: string
	right: string
	gradient: string
}

type EmptyStateProps = {
	title?: string
	description?: string
	buttonText?: string
	buttonIcon?: ReactNode
	onButtonClick?: () => void
	badges?: Array<{
		left: string
		right: string
		gradient: string
	}>
	squaresCount?: number
	className?: string
}

const ANIMATION_CONFIG = {
	initial: { opacity: 0, y: 20 },
	animate: { opacity: 1, y: 0 },
	transition: { duration: 0.5 }
} as const

const SIZES = {
	sm: 'w-6 h-6',
	md: 'w-12 h-12',
	lg: 'w-16 h-16'
} as const

function BackgroundSquare({
	size = 'md',
	position,
	index
}: BackgroundSquareProps) {
	return (
		<motion.div
			initial={{ opacity: 0, scale: 0 }}
			animate={{
				opacity: [0.05, 0.12, 0.05],
				scale: [1, 1.2, 1],
				rotate: [position.rotate, position.rotate + 10, position.rotate]
			}}
			transition={{
				duration: 4 + Math.random() * 2,
				repeat: Infinity,
				delay: index * 0.1
			}}
			className={`absolute ${SIZES[size]} bg-white rounded-sm transform`}
			style={{
				top: `${position.top}%`,
				left: `${position.left}%`,
				rotate: `${position.rotate}deg`
			}}
		/>
	)
}

function FloatingCard({ children, delay, offset }: FloatingCardProps) {
	const cardRef = useRef<HTMLDivElement>(null)
	const mousePosition = useRef({ x: 0, y: 0 })
	const springX = useSpring(0, { stiffness: 150, damping: 15 })
	const springY = useSpring(0, { stiffness: 150, damping: 15 })

	useEffect(() => {
		const handleMouseMove = (e: MouseEvent) => {
			if (cardRef.current) {
				const rect = cardRef.current.getBoundingClientRect()
				const cardCenterX = rect.left + rect.width / 2
				const cardCenterY = rect.top + rect.height / 2

				// Calculate distance from mouse to card center
				const deltaX = e.clientX - cardCenterX
				const deltaY = e.clientY - cardCenterY
				const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)

				// Random factor to determine if card is attracted or repelled
				const isAttracting =
					Math.sin(distance * 0.05 + Date.now() * 0.001) > 0
				const factor = isAttracting ? 0.15 : -0.15
				const intensity = Math.min(1, 100 / distance) * factor

				springX.set(deltaX * intensity)
				springY.set(deltaY * intensity)
			}
		}

		window.addEventListener('mousemove', handleMouseMove)
		return () => window.removeEventListener('mousemove', handleMouseMove)
	}, [springX, springY])

	return (
		<motion.div
			ref={cardRef}
			initial={{ opacity: 0, scale: 0.9 }}
			animate={{
				opacity: 1,
				y: [0, -10, 0],
				x: [0, 5, 0],
				rotate: [offset.rotate, offset.rotate + 2, offset.rotate]
			}}
			whileHover={{
				scale: 1.02,
				transition: { duration: 0.2 }
			}}
			style={{
				x: springX,
				y: springY
			}}
			transition={{
				opacity: { duration: 0.5, delay },
				scale: { duration: 0.5, delay },
				default: {
					duration: 3,
					repeat: Infinity,
					repeatType: 'reverse',
					ease: 'easeInOut',
					delay: delay + Math.random()
				}
			}}
			className="mb-6 last:mb-0"
		>
			<div className="relative group">
				<div className="absolute inset-0 bg-white/[0.02] rounded-xl transform translate-x-2 translate-y-2 transition-transform duration-200 group-hover:translate-x-3 group-hover:translate-y-3" />
				<div className="relative bg-zinc-900/50 backdrop-blur-sm border border-white/[0.1] rounded-xl p-5 flex justify-between items-start min-w-[320px] transition-all duration-200 group-hover:bg-zinc-900/60 group-hover:border-white/[0.15]">
					<div className="space-y-3">
						<motion.div
							className="h-2 bg-zinc-600 rounded-full w-32 group-hover:bg-zinc-500 transition-colors duration-200"
							initial={{ scaleX: 0 }}
							animate={{ scaleX: 1 }}
							transition={{ delay: delay + 0.2, duration: 0.5 }}
						/>
						<motion.div
							className="h-2 bg-zinc-600 rounded-full w-24 group-hover:bg-zinc-500 transition-colors duration-200"
							initial={{ scaleX: 0 }}
							animate={{ scaleX: 1 }}
							transition={{ delay: delay + 0.3, duration: 0.5 }}
						/>
					</div>
					{children}
				</div>
			</div>
		</motion.div>
	)
}

function Badge({ left, right, gradient }: BadgeProps) {
	return (
		<motion.div
			className="flex items-center"
			style={{
				background: gradient,
				padding: '2px',
				borderRadius: '999px'
			}}
			whileHover={{ scale: 1.05 }}
		>
			<div className="flex -space-x-1">
				<div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-medium text-white backdrop-blur-sm">
					{left}
				</div>
				<div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-medium text-white backdrop-blur-sm">
					{right}
				</div>
			</div>
		</motion.div>
	)
}

export default function EmptyState({
	title = 'Start by creating a snippet',
	description = 'Create and organize your code snippets. Share them with your team and access them from anywhere. Just like that.',
	buttonText = 'Create a snippet',
	buttonIcon = <Plus className="w-5 h-5" />,
	onButtonClick,
	badges = [
		{
			left: 'RI',
			right: 'PL',
			gradient:
				'linear-gradient(90deg, rgb(255, 138, 76), rgb(139, 227, 173))'
		},
		{
			left: 'VL',
			right: 'SS',
			gradient:
				'linear-gradient(90deg, rgb(233, 109, 233), rgb(99, 179, 237))'
		},
		{
			left: 'YD',
			right: 'AB',
			gradient:
				'linear-gradient(90deg, rgb(129, 230, 149), rgb(248, 113, 113))'
		}
	],
	squaresCount = 25,
	className = ''
}: EmptyStateProps) {
	const squares = Array.from({ length: squaresCount }, (_, i) => ({
		size: i % 3 === 0 ? 'lg' : i % 2 === 0 ? 'md' : 'sm',
		position: {
			top: Math.random() * 200 - 50,
			left: Math.random() * 200 - 50,
			rotate: Math.random() * 360
		}
	}))

	return (
		<div
			className={`min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-8 overflow-hidden ${className}`}
		>
			<div className="relative w-full max-w-3xl">
				{/* Background squares */}
				{squares.map((square, i) => (
					<BackgroundSquare
						key={i}
						index={i}
						size={square.size}
						position={square.position}
					/>
				))}

				{/* Centered floating cards */}
				<div className="absolute inset-0 flex items-center justify-center">
					<div className="relative w-full max-w-lg">
						{badges.map((badge, index) => {
							// Increased vertical spacing to 60px between cards
							const stackOffset = 60
							const horizontalOffset = 15
							const x =
								index * horizontalOffset -
								((badges.length - 1) * horizontalOffset) / 2
							const y = index * stackOffset

							return (
								<div
									key={index}
									className="absolute"
									style={{
										left: '50%',
										top: '50%',
										transform: `translate(calc(${x}px - 50%), calc(${y - (badges.length * stackOffset) / 2}px - 50%))`,
										zIndex: index
									}}
								>
									<FloatingCard
										delay={0.1 * (index + 1)}
										offset={{
											x: 0,
											y: 0,
											rotate:
												(index % 2 === 0 ? -1 : 1) *
												(index + 1)
										}}
									>
										<Badge {...badge} />
									</FloatingCard>
								</div>
							)
						})}
					</div>
				</div>

				{/* Content overlay with very subtle blur */}
				<div className="relative z-10">
					<motion.div
						{...ANIMATION_CONFIG}
						transition={{ delay: 0.8, duration: 0.5 }}
						className="text-center"
					>
						<div className="backdrop-blur-[1px] bg-gradient-to-b from-zinc-950/10 to-zinc-950/30 rounded-3xl p-8">
							<motion.h2
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								transition={{ delay: 1, duration: 0.5 }}
								className="text-4xl font-bold text-white mb-6"
							>
								{title}
							</motion.h2>
							<motion.p
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								transition={{ delay: 1.2, duration: 0.5 }}
								className="text-zinc-300 max-w-md mx-auto mb-10 leading-relaxed text-lg"
							>
								{description}
							</motion.p>
							<motion.button
								initial={{ opacity: 0, scale: 0.9 }}
								animate={{ opacity: 1, scale: 1 }}
								transition={{ delay: 1.4, duration: 0.3 }}
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
								onClick={onButtonClick}
								className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-zinc-800/80 text-white font-medium hover:bg-zinc-700/80 transition-colors"
							>
								{buttonIcon}
								{buttonText}
							</motion.button>
						</div>
					</motion.div>
				</div>
			</div>
		</div>
	)
}
