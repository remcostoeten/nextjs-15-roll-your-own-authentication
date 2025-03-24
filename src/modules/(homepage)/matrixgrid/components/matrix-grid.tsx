'use client'

import type React from 'react'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import styles from '../styles/matrix-grid.module.css'
import { matrixGridContent } from '../data/matrix-grid-content'
import MatrixGridLayout from './matrix-grid-layout'
import { useMatrixRain } from '../hooks/use-matrix-rain'
import { MATRIX_GRID_CONFIG } from '../config/matrix-grid-config'
import { CodeBlock } from '../../components/hero/code-block'
import { useInView } from 'react-intersection-observer'

// Add import for custom animations
import '../styles/custom-animations.css'

// Add these imports and hooks at the top of the component
// Add after the existing imports:
import { useScroll } from 'framer-motion'

// Update the MatrixRain component to be more visible
const MatrixRain = () => {
	const canvasRef = useMatrixRain(true)

	return (
		<div
			className={`${styles.matrixRain}`}
			aria-hidden="true"
		>
			<canvas ref={canvasRef}></canvas>
		</div>
	)
}

// Update the Arrow component to remove bounce animation
const Arrow = () => (
	<svg
		width="20"
		height="20"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
		className={`${styles.arrow} card-hover-only color-shift-animation`}
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

// Helper function to get a random value within a range
const getRandomInRange = (min: number, max: number) => {
	return Math.random() * (max - min) + min
}

// Helper function to get a slightly randomized color
const getRandomizedColor = (baseColor: string, variance = 0.1) => {
	// Parse the rgba color
	const rgbaMatch = baseColor.match(/rgba$$(\d+),\s*(\d+),\s*(\d+),\s*([\d.]+)$$/)
	if (!rgbaMatch) return baseColor

	const r = Number.parseInt(rgbaMatch[1], 10)
	const g = Number.parseInt(rgbaMatch[2], 10)
	const b = Number.parseInt(rgbaMatch[3], 10)
	const a = Number.parseFloat(rgbaMatch[4])

	// Add slight randomization to the green and alpha channels
	// Keep the green high since it's matrix-themed
	const newG = Math.min(255, Math.max(0, g + getRandomInRange(-g * variance, g * variance)))
	const newA = Math.min(1, Math.max(0, a + getRandomInRange(-a * variance, a * variance)))

	return `rgba(${r}, ${newG}, ${b}, ${newA.toFixed(2)})`
}

// Update the card hover animation to include spotlight effect
const cardVariants = {
	initial: {
		borderColor: '#1e1e1e',
		boxShadow: 'none',
	},
	hover: {
		borderColor: 'rgba(78, 152, 21, 0.15)',
		boxShadow: '0 0 30px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(78, 152, 21, 0.1)',
		transition: {
			duration: 0.4,
			ease: 'easeOut',
		},
	},
}

// Update the content animation on hover
const contentVariants = {
	initial: {
		opacity: 0.9,
	},
	hover: {
		opacity: 1,
		transition: { duration: 0.3 },
	},
}

export default function MatrixGrid() {
	const [mounted, setMounted] = useState(false)
	const cardRefs = useRef<(HTMLAnchorElement | null)[]>([])

	// Add refs for the container and header elements
	const containerRef = useRef<HTMLDivElement>(null)
	const isInView = useInView(containerRef, { once: true, amount: 0.2 })
	const [activeTab, setActiveTab] = useState<number>(0)
	const headerRef = useRef<HTMLDivElement>(null)
	const gridRef = useRef<HTMLDivElement>(null)

	// Add these refs and state inside the component, after the existing state declarations:
	const codeBlockRef = useRef<HTMLDivElement>(null)
	const [isCodeBlockSticky, setIsCodeBlockSticky] = useState(false)
	const { scrollY } = useScroll()

	useEffect(() => {
		setMounted(true)
	}, [])

	useEffect(() => {
		const handleMouseMove = (e: MouseEvent, card: HTMLElement) => {
			const rect = card.getBoundingClientRect()
			const x = e.clientX - rect.left
			const y = e.clientY - rect.top

			// Add slight randomization to the mouse position (1-3px)
			const randomOffsetX = getRandomInRange(-3, 3)
			const randomOffsetY = getRandomInRange(-3, 3)

			const xPercent = ((x + randomOffsetX) / rect.width) * 100
			const yPercent = ((y + randomOffsetY) / rect.height) * 100

			card.style.setProperty('--mouse-x', `${xPercent}%`)
			card.style.setProperty('--mouse-y', `${yPercent}%`)
		}

		const handleMouseEnter = (card: HTMLElement) => {
			// Get base values from config
			const baseColor = MATRIX_GRID_CONFIG.SPOTLIGHT.COLOR
			const baseStrength = MATRIX_GRID_CONFIG.SPOTLIGHT.STRENGTH
			const baseRadius = MATRIX_GRID_CONFIG.SPOTLIGHT.RADIUS

			// Add subtle randomization to the spotlight parameters
			const randomizedColor = getRandomizedColor(baseColor, 0.15)
			const randomizedStrength = baseStrength * getRandomInRange(0.9, 1.1)
			const randomizedRadius = baseRadius * getRandomInRange(0.95, 1.05)

			card.style.setProperty('--spotlight-color', randomizedColor)
			card.style.setProperty('--spotlight-strength', randomizedStrength.toString())
			card.style.setProperty('--spotlight-radius', `${randomizedRadius}%`)
		}

		cardRefs.current.forEach((card) => {
			if (card) {
				card.addEventListener('mousemove', (e) => handleMouseMove(e, card))
				card.addEventListener('mouseenter', () => handleMouseEnter(card))
			}
		})

		return () => {
			cardRefs.current.forEach((card) => {
				if (card) {
					card.removeEventListener('mousemove', (e) => handleMouseMove(e, card))
					card.removeEventListener('mouseenter', () => handleMouseEnter(card))
				}
			})
		}
	}, [cardRefs, mounted])

	// Update the matrix rain spotlight effect to be more prominent
	useEffect(() => {
		const handleMatrixSpotlight = (e: MouseEvent, card: HTMLElement) => {
			const rect = card.getBoundingClientRect()
			const x = e.clientX - rect.left
			const y = e.clientY - rect.top

			// Calculate percentage positions for the spotlight
			const xPercent = (x / rect.width) * 100
			const yPercent = (y / rect.height) * 100

			// Set custom properties for the spotlight position
			card.style.setProperty('--spotlight-x', `${xPercent}%`)
			card.style.setProperty('--spotlight-y', `${yPercent}%`)

			// Find the matrix rain element and adjust its mask
			const matrixRain = card.querySelector(`.${styles.matrixRain}`) as HTMLElement
			if (matrixRain) {
				matrixRain.style.opacity = '0.5' // Increased from 0.3 to 0.5 for better visibility
				matrixRain.style.maskImage = `radial-gradient(circle 120px at ${xPercent}% ${yPercent}%, black 0%, transparent 80%)`
				matrixRain.style.webkitMaskImage = `radial-gradient(circle 120px at ${xPercent}% ${yPercent}%, black 0%, transparent 80%)`
			}
		}

		const handleMatrixLeave = (card: HTMLElement) => {
			// Reset the matrix rain effect when mouse leaves
			const matrixRain = card.querySelector(`.${styles.matrixRain}`) as HTMLElement
			if (matrixRain) {
				matrixRain.style.opacity = '0'
				// Reset the mask to default
				matrixRain.style.maskImage = ''
				matrixRain.style.webkitMaskImage = ''
			}
		}

		cardRefs.current.forEach((card) => {
			if (card) {
				card.addEventListener('mousemove', (e) => handleMatrixSpotlight(e, card))
				card.addEventListener('mouseleave', () => handleMatrixLeave(card))
			}
		})

		return () => {
			cardRefs.current.forEach((card) => {
				if (card) {
					card.removeEventListener('mousemove', (e) => handleMatrixSpotlight(e, card))
					card.removeEventListener('mouseleave', () => handleMatrixLeave(card))
				}
			})
		}
	}, [cardRefs, mounted])

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
	const [headerTitle, setHeaderTitle] = useState(matrixGridContent.header.title)
	const [headerSubtitle, setHeaderSubtitle] = useState(matrixGridContent.header.subtitle)
	const [isScrambling, setIsScrambling] = useState(false)

	// Characters for scrambling
	const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%^&*()_+~`|}{[]\\:;?><,./-='

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

			setHeaderTitle(scrambleText(matrixGridContent.header.title, progress))
			setHeaderSubtitle(scrambleText(matrixGridContent.header.subtitle, progress))

			if (progress >= 1) {
				clearInterval(interval)
				setHeaderTitle(matrixGridContent.header.title)
				setHeaderSubtitle(matrixGridContent.header.subtitle)
				setIsScrambling(false)
			}
		}, 50)

		return () => clearInterval(interval)
	}, [mounted])

	// Add this useEffect to handle the scroll behavior
	// Update the layout structure to ensure the code block and matrix grid are side by side
	// Find the section where the header and grid are defined and ensure they're properly structured

	// In the return statement, make sure the layout is correct
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
							<div className="code-block-wrapper">
								<div
									className="code-block-container"
									ref={codeBlockRef}
								>
									<CodeBlock />
								</div>
							</div>

							{/* Updated header styling to fit the theme better */}
							<div className="mt-8 border-t border-l border-[#1E1E1E] p-6 relative overflow-hidden">
								{/* Matrix rain background */}
								<div className="absolute inset-0 opacity-5">
									<MatrixRain />
								</div>

								{/* Terminal-style header */}
								<div className="relative z-10">
									<div className="flex items-center mb-3">
										<div className="h-2 w-2 rounded-full bg-[#4e9815] mr-2"></div>
										<span className="text-xs text-[#8C877D] font-mono">system.auth.module</span>
									</div>

									<h2 className="text-2xl font-mono bg-gradient-to-b from-[#F2F0ED] to-[#ADADAD] bg-clip-text text-transparent mb-3">
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
										ref={(el) => (cardRefs.current[index] = el)}
										{...(tool.href.startsWith('http')
											? { target: '_blank', rel: 'noopener noreferrer' }
											: {})}
										initial="initial"
										whileHover="hover"
										variants={cardVariants}
										style={
											{
												'--spotlight-x': '50%',
												'--spotlight-y': '50%',
											} as React.CSSProperties
										}
									>
										{/* Ensure MatrixRain is the first child for proper z-indexing */}
										<MatrixRain />
										<div
											className={styles.cardSpotlight}
											style={{
												background:
													'radial-gradient(circle 120px at var(--spotlight-x, 50%) var(--spotlight-y, 50%), rgba(78, 152, 21, 0.25), transparent 80%)',
											}}
										></div>
										<motion.div
											className={`${styles.cardContent} ${styles.cardContentWrapper}`}
											variants={contentVariants}
										>
											<div>
												<motion.div className={styles.cardHeader}>
													<motion.h3
														className={`${styles.cardTitle} bg-gradient-to-b from-[#F2F0ED] to-[#ADADAD] bg-clip-text text-transparent`}
													>
														{tool.title}
													</motion.h3>
													{tool.tag && (
														<motion.div
															className={`${styles.tag} ${
																tool.tag?.type === 'new'
																	? styles.tagNew
																	: tool.tag?.type === 'soon'
																		? styles.tagSoon
																		: ''
															}`}
														>
															{tool.tag.text}
														</motion.div>
													)}
												</motion.div>
												<motion.div className={styles.cardDescription}>
													{tool.description}
												</motion.div>
											</div>
											{!tool.isLarge && (
												<motion.div className="self-end">
													<Arrow />
												</motion.div>
											)}
										</motion.div>
										{tool.isLarge && (
											<>
												<motion.div
													className={styles.skeletonLoader}
													aria-hidden="true"
													variants={itemVariants}
												/>
												<motion.div
													className={styles.platformGradient}
													variants={itemVariants}
												/>
												<motion.div
													className={styles.platformSideGradient}
													variants={itemVariants}
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
