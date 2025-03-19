'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import styles from './matrix-grid.module.css'
import { matrixGridContent } from './matrix-grid-content'
import { isMatrixGridAnimationEnabled } from '../../core/config/feature-flags'
import MatrixGridLayout from './matrix-grid-layout'
import { CodeBlock } from './code-block'

const Arrow = () => (
	<svg
		width="20"
		height="20"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
		className={styles.arrow}
	>
		<path
			d="M1.057 1.011v11.859h17.21"
			stroke="currentColor"
			strokeLinecap="square"
			strokeLinejoin="bevel"
		/>
		<path
			d="m13.467 7.354 5.516 5.516"
			stroke="currentColor"
			strokeLinecap="square"
			strokeLinejoin="bevel"
		/>
		<path
			d="m18.983 12.87-5.516 5.516"
			stroke="currentColor"
			strokeLinecap="square"
			strokeLinejoin="bevel"
		/>
	</svg>
)

const MotionLink = motion(Link)

// Simple matrix rain effect directly in the component
const MatrixSpotlight = ({ mouseX = 50, mouseY = 50 }) => {
	const canvasRef = useRef<HTMLCanvasElement>(null)
	const animationRef = useRef<number | null>(null)

	useEffect(() => {
		const canvas = canvasRef.current
		if (!canvas) return

		const ctx = canvas.getContext('2d')
		if (!ctx) return

		canvas.width = canvas.offsetWidth
		canvas.height = canvas.offsetHeight

		const fontSize = 12 // Smaller font size
		const columns = Math.floor(canvas.width / fontSize)
		const drops: number[] = []

		for (let i = 0; i < columns; i++) {
			drops[i] = Math.floor(Math.random() * -canvas.height)
		}

		const draw = () => {
			// More transparent background for subtler effect
			ctx.fillStyle = 'rgba(0, 0, 0, 0.03)'
			ctx.fillRect(0, 0, canvas.width, canvas.height)

			// Softer green text
			ctx.fillStyle = 'rgba(78, 152, 21, 0.6)'
			ctx.font = `${fontSize}px monospace`

			// Drawing the characters
			for (let i = 0; i < drops.length; i++) {
				// Random character
				const text = String.fromCharCode(
					Math.floor(Math.random() * 94) + 33
				)

				// x = i * fontSize, y = drops[i] * fontSize
				ctx.fillText(text, i * fontSize, drops[i] * fontSize)

				// Sending the drop back to the top randomly after it has crossed the screen
				if (
					drops[i] * fontSize > canvas.height &&
					Math.random() > 0.975
				) {
					drops[i] = 0
				}

				// Incrementing Y coordinate - slower speed
				drops[i] += 0.5
			}

			animationRef.current = requestAnimationFrame(draw)
		}

		draw()

		return () => {
			if (animationRef.current) {
				cancelAnimationFrame(animationRef.current)
			}
		}
	}, [])

	return (
		<div
			className={styles.matrixSpotlight}
			style={{
				clipPath: `circle(80% at ${mouseX}% ${mouseY}%)`, // Larger spotlight with softer edge
			}}
		>
			<canvas
				ref={canvasRef}
				width="100%"
				height="100%"
			/>
		</div>
	)
}

// Helper function to get a random value within a range
const getRandomInRange = (min: number, max: number) => {
	return Math.random() * (max - min) + min
}

// Helper function to get a slightly randomized color
const getRandomizedColor = (baseColor: string, variance = 0.1) => {
	// Parse the rgba color
	const rgbaMatch = baseColor.match(
		/rgba$$(\d+),\s*(\d+),\s*(\d+),\s*([\d.]+)$$/
	)
	if (!rgbaMatch) return baseColor

	const r = Number.parseInt(rgbaMatch[1], 10)
	const g = Number.parseInt(rgbaMatch[2], 10)
	const b = Number.parseInt(rgbaMatch[3], 10)
	const a = Number.parseFloat(rgbaMatch[4])

	// Add slight randomization to the green and alpha channels
	// Keep the green high since it's matrix-themed
	const newG = Math.min(
		255,
		Math.max(0, g + getRandomInRange(-g * variance, g * variance))
	)
	const newA = Math.min(
		1,
		Math.max(0, a + getRandomInRange(-a * variance, a * variance))
	)

	return `rgba(${r}, ${newG}, ${b}, ${newA.toFixed(2)})`
}

export default function MatrixGrid() {
	const [mounted, setMounted] = useState(false)
	const animationsEnabled = isMatrixGridAnimationEnabled('grid')
	const cardRefs = useRef<(HTMLAnchorElement | null)[]>([])

	// Add refs for the container and header elements
	const containerRef = useRef<HTMLDivElement>(null)
	const headerRef = useRef<HTMLDivElement>(null)
	const gridRef = useRef<HTMLDivElement>(null)

	// Add this state to track which card is being hovered
	const [hoveredCardIndex, setHoveredCardIndex] = useState<number | null>(
		null
	)
	// Add state to track mouse position within each card
	const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 })

	useEffect(() => {
		setMounted(true)
	}, [])

	useEffect(() => {
		const handleMouseMove = (
			e: MouseEvent,
			card: HTMLElement,
			index: number
		) => {
			const rect = card.getBoundingClientRect()
			const x = e.clientX - rect.left
			const y = e.clientY - rect.top

			const xPercent = (x / rect.width) * 100
			const yPercent = (y / rect.height) * 100

			card.style.setProperty('--mouse-x', `${xPercent}%`)
			card.style.setProperty('--mouse-y', `${yPercent}%`)

			// Update mouse position state if this is the hovered card
			if (hoveredCardIndex === index) {
				setMousePosition({ x: xPercent, y: yPercent })
			}
		}

		const handleMouseEnter = (card: HTMLElement, index: number) => {
			// Get base values from config
			const baseColor = 'rgba(78, 152, 21, 0.15)' // Reduced opacity
			const baseStrength = 0.7 // Further reduced strength for softer effect
			const baseRadius = 120 // Larger radius for softer edge

			// Add subtle randomization to the spotlight parameters
			const randomizedColor = getRandomizedColor(baseColor, 0.1)
			const randomizedStrength = baseStrength * getRandomInRange(0.9, 1.1)
			const randomizedRadius = baseRadius * getRandomInRange(0.95, 1.05)

			card.style.setProperty('--spotlight-color', randomizedColor)
			card.style.setProperty(
				'--spotlight-strength',
				randomizedStrength.toString()
			)
			card.style.setProperty('--spotlight-radius', `${randomizedRadius}%`)

			// Set the hovered card index
			setHoveredCardIndex(index)
		}

		cardRefs.current.forEach((card, index) => {
			if (card) {
				card.addEventListener('mousemove', (e) =>
					handleMouseMove(e, card, index)
				)
				card.addEventListener('mouseenter', () =>
					handleMouseEnter(card, index)
				)
				card.addEventListener('mouseleave', () =>
					setHoveredCardIndex(null)
				)
			}
		})

		return () => {
			cardRefs.current.forEach((card, index) => {
				if (card) {
					card.removeEventListener('mousemove', (e) =>
						handleMouseMove(e, card, index)
					)
					card.removeEventListener('mouseenter', () =>
						handleMouseEnter(card, index)
					)
					card.removeEventListener('mouseleave', () =>
						setHoveredCardIndex(null)
					)
				}
			})
		}
	}, [cardRefs, mounted, hoveredCardIndex])

	const containerVariants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: {
				staggerChildren: 0.1,
				delayChildren: 0.5, // Increased delay to allow hero animations to complete first
			},
		},
	}

	const itemVariants = {
		hidden: { opacity: 0, y: 20 },
		visible: {
			opacity: 1,
			y: 0,
			transition: {
				type: 'spring',
				stiffness: 100,
				damping: 15,
			},
		},
	}

	const textVariants = {
		hidden: { opacity: 0, y: -20 },
		visible: {
			opacity: 1,
			y: 0,
			transition: {
				type: 'spring',
				stiffness: 100,
				damping: 15,
			},
		},
	}

	// Matrix-style text scrambling effect for the header
	const [headerTitle, setHeaderTitle] = useState(
		matrixGridContent.header.title
	)
	const [headerSubtitle, setHeaderSubtitle] = useState(
		matrixGridContent.header.subtitle
	)
	const [isScrambling, setIsScrambling] = useState(false)

	// Characters for scrambling
	const chars =
		'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%^&*()_+~`|}{[]\\:;?><,./-='

	// Function to scramble text
	const scrambleText = (text: string, progress: number) => {
		return text
			.split('')
			.map((char, i) => {
				if (char === ' ') return ' '
				if (Math.random() > progress) {
					return chars[Math.floor(Math.random() * chars.length)]
				}
				return char
			})
			.join('')
	}

	// Scramble effect on mount
	useEffect(() => {
		if (!mounted) return

		setIsScrambling(true)

		let progress = 0
		const interval = setInterval(() => {
			progress += 0.05

			setHeaderTitle(
				scrambleText(matrixGridContent.header.title, progress)
			)
			setHeaderSubtitle(
				scrambleText(matrixGridContent.header.subtitle, progress)
			)

			if (progress >= 1) {
				clearInterval(interval)
				setHeaderTitle(matrixGridContent.header.title)
				setHeaderSubtitle(matrixGridContent.header.subtitle)
				setIsScrambling(false)
			}
		}, 50)

		return () => clearInterval(interval)
	}, [mounted])

	return (
		<MatrixGridLayout>
			<motion.div
				className={styles.container}
				initial="hidden"
				animate="visible"
				variants={containerVariants}
				ref={containerRef}
				style={{ borderTop: 'none', paddingTop: '80px' }} // Adjusted padding to align with code block tabs
			>
				<div className={styles.wrapper}>
					<motion.div
						className={styles.header}
						variants={itemVariants}
						ref={headerRef}
						style={{ borderTop: 'none' }}
					>
						<div className={styles.stickyContainer}>
							<CodeBlock />

							{/* Updated header styling to fit the theme better */}
							<div className="mt-8 border-t border-l border-[#1E1E1E] p-4 relative overflow-hidden">
								{/* Terminal-style header */}
								<div className="relative z-10">
									<div className="flex items-center mb-2">
										<div className="h-2 w-2 rounded-full bg-[#4e9815] mr-2"></div>
										<span className="text-xs text-[#8C877D] font-mono">
											system.auth.module
										</span>
									</div>

									<h2 className="text-xl font-mono bg-gradient-to-b from-[#F2F0ED] to-[#ADADAD] bg-clip-text text-transparent mb-2">
										{headerTitle}
									</h2>

									<p className="text-[#8C877D] text-sm font-mono border-l-2 border-[#1E1E1E] pl-3">
										{headerSubtitle}
									</p>

									<div className="mt-4 flex items-center text-xs text-[#4e9815] font-mono">
										<span className="mr-1">$</span>
										<span className="animate-pulse">_</span>
									</div>
								</div>
							</div>
						</div>
					</motion.div>

					<AnimatePresence>
						{mounted && (
							<motion.div
								className={styles.grid}
								variants={containerVariants}
								ref={gridRef}
							>
								{matrixGridContent.tools.map((tool, index) => (
									<MotionLink
										key={tool.title}
										href={tool.href}
										className={`${styles.card} ${tool.isLarge ? styles.platformCard : ''} ${
											index < 3 ? styles.noTopBorder : ''
										} ${tool.isLarge ? styles.largeBorders : ''}`}
										variants={itemVariants}
										ref={(el) =>
											(cardRefs.current[index] = el)
										}
										{...(tool.href.startsWith('http')
											? {
													target: '_blank',
													rel: 'noopener noreferrer',
												}
											: {})}
										onMouseEnter={() =>
											setHoveredCardIndex(index)
										}
										onMouseLeave={() =>
											setHoveredCardIndex(null)
										}
									>
										{/* Only render MatrixRain when this card is hovered */}
										{hoveredCardIndex === index && (
											<MatrixSpotlight
												mouseX={mousePosition.x}
												mouseY={mousePosition.y}
											/>
										)}
										<div
											className={`${styles.cardSpotlight} ${hoveredCardIndex === index ? styles.activeSpotlight : ''}`}
										></div>
										<motion.div
											className={`${styles.cardContent} ${styles.cardContentWrapper}`}
											variants={textVariants}
										>
											<div>
												<motion.div
													className={
														styles.cardHeader
													}
													variants={textVariants}
												>
													<motion.h3
														className={`${styles.cardTitle} bg-gradient-to-b from-[#F2F0ED] to-[#ADADAD] bg-clip-text text-transparent`}
														variants={textVariants}
													>
														{tool.title}
													</motion.h3>
													{tool.tag && (
														<motion.div
															className={`${styles.tag} ${tool.tag.type === 'new' ? styles.tagNew : styles.tagSoon}`}
															variants={
																textVariants
															}
														>
															{tool.tag.text}
														</motion.div>
													)}
												</motion.div>
												<motion.div
													className={
														styles.cardDescription
													}
													variants={textVariants}
												>
													{tool.description
														.split(' ')
														.slice(0, 15)
														.join(' ')}
													{tool.description.split(' ')
														.length > 15
														? '...'
														: ''}
												</motion.div>
											</div>
											{!tool.isLarge && (
												<motion.div
													variants={textVariants}
													className={
														styles.arrowContainer
													}
												>
													<Arrow />
												</motion.div>
											)}
										</motion.div>
										{tool.isLarge && (
											<>
												<motion.div
													className={
														styles.skeletonLoader
													}
													aria-hidden="true"
													variants={itemVariants}
													style={{ opacity: 0.4 }} // Reduced opacity
												/>
												<motion.div
													className={
														styles.platformGradient
													}
													variants={itemVariants}
													style={{ opacity: 0.3 }} // Reduced opacity
												/>
												<motion.div
													className={
														styles.platformSideGradient
													}
													variants={itemVariants}
													style={{ opacity: 0.3 }} // Reduced opacity
												/>
											</>
										)}
										<motion.div
											className={styles.horizontalBorder}
											variants={itemVariants}
										/>
									</MotionLink>
								))}
							</motion.div>
						)}
					</AnimatePresence>
				</div>
			</motion.div>
		</MatrixGridLayout>
	)
}
