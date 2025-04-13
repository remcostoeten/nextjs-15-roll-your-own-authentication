'use client'

import type React from 'react'

import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'

type TProps = {
	isHovered: boolean
}

export function PurpleGlareEffect({ isHovered = true }: TProps) {
	const containerRef = useRef<HTMLDivElement>(null)
	const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
	const [smoothMousePosition, setSmoothMousePosition] = useState({
		x: 0,
		y: 0,
	})

	// Update smooth mouse position with animation frame for better performance
	useEffect(() => {
		if (!isHovered) return

		let animationFrameId: number

		const updateSmoothPosition = () => {
			setSmoothMousePosition((prev) => ({
				x: prev.x + (mousePosition.x - prev.x) * 0.1,
				y: prev.y + (mousePosition.y - prev.y) * 0.1,
			}))
			animationFrameId = requestAnimationFrame(updateSmoothPosition)
		}

		animationFrameId = requestAnimationFrame(updateSmoothPosition)

		return () => {
			cancelAnimationFrame(animationFrameId)
		}
	}, [isHovered, mousePosition])

	// Track mouse position
	const handleMouseMove = (e: React.MouseEvent) => {
		if (containerRef.current) {
			const rect = containerRef.current.getBoundingClientRect()
			setMousePosition({
				x: e.clientX - rect.left,
				y: e.clientY - rect.top,
			})
		}
	}

	return (
		<motion.div
			ref={containerRef}
			initial={{ opacity: 0 }}
			animate={{ opacity: isHovered ? 1 : 0 }}
			transition={{ duration: 0.3 }}
			className="absolute inset-0 overflow-hidden pointer-events-none"
			onMouseMove={handleMouseMove}
		>
			{/* Main purple glare sweep */}
			<motion.div
				className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-400/30 to-transparent"
				initial={{ x: '-100%' }}
				animate={{ x: isHovered ? '100%' : '-100%' }}
				transition={{
					duration: 1.5,
					ease: 'easeInOut',
					repeat: isHovered ? Number.POSITIVE_INFINITY : 0,
					repeatDelay: 2,
				}}
			/>

			{/* Secondary purple glow */}
			<motion.div
				className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-purple-400/20 to-purple-500/10"
				initial={{ x: '-100%' }}
				animate={{ x: isHovered ? '100%' : '-100%' }}
				transition={{
					duration: 2,
					ease: 'easeInOut',
					repeat: isHovered ? Number.POSITIVE_INFINITY : 0,
					repeatDelay: 1,
				}}
			/>

			{/* Interactive particles */}
			{isHovered &&
				Array.from({ length: 8 }).map((_, i) => {
					const initialX = Math.random() * 100
					const initialY = Math.random() * 100

					return (
						<motion.div
							key={i}
							className="absolute w-1 h-1 bg-purple-300/50 rounded-full"
							style={{
								left: `${initialX}%`,
								top: `${initialY}%`,
							}}
							animate={{
								x: [
									0,
									(smoothMousePosition.x -
										(initialX *
											(containerRef.current
												?.clientWidth || 100)) /
											100) *
										0.1,
								],
								y: [
									0,
									(smoothMousePosition.y -
										(initialY *
											(containerRef.current
												?.clientHeight || 100)) /
											100) *
										0.1,
								],
								opacity: [0, 0.4, 0],
								scale: [1, 1.5, 1],
							}}
							transition={{
								duration: 2 + Math.random(),
								repeat: Number.POSITIVE_INFINITY,
								repeatType: 'reverse',
								ease: 'easeInOut',
							}}
						/>
					)
				})}
		</motion.div>
	)
}
