'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'

export function Logo() {
	const [isHovered, setIsHovered] = useState(false)
	const canvasRef = useRef<HTMLCanvasElement>(null)
	const requestRef = useRef<number>()

	// Matrix rain effect for the logo
	useEffect(() => {
		if (!isHovered || !canvasRef.current) return

		const canvas = canvasRef.current
		const ctx = canvas.getContext('2d')
		if (!ctx) return

		canvas.width = canvas.offsetWidth
		canvas.height = canvas.offsetHeight

		const fontSize = 10
		const columns = Math.floor(canvas.width / fontSize)
		const drops: number[] = Array(columns).fill(1)

		// Binary characters for matrix effect
		const chars = '01'

		const drawMatrixRain = () => {
			// Semi-transparent black to create fade effect
			ctx.fillStyle = 'rgba(13, 12, 12, 0.1)'
			ctx.fillRect(0, 0, canvas.width, canvas.height)

			ctx.fillStyle = '#0f0'
			ctx.font = `${fontSize}px monospace`

			for (let i = 0; i < drops.length; i++) {
				// Random character (only 0 and 1 for binary look)
				const char = chars[Math.floor(Math.random() * chars.length)]

				// Draw the character
				ctx.fillText(char, i * fontSize, drops[i] * fontSize)

				// Reset drop when it reaches bottom or randomly
				if (
					drops[i] * fontSize > canvas.height &&
					Math.random() > 0.95
				) {
					drops[i] = 0
				}

				// Move drop down
				drops[i]++
			}

			requestRef.current = requestAnimationFrame(drawMatrixRain)
		}

		requestRef.current = requestAnimationFrame(drawMatrixRain)

		return () => {
			if (requestRef.current) {
				cancelAnimationFrame(requestRef.current)
			}
		}
	}, [isHovered])

	return (
		<motion.div
			className="relative"
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
			whileHover={{ scale: 1.05 }}
			transition={{ type: 'spring', stiffness: 400, damping: 10 }}
		>
			<Link
				href="/"
				className="flex items-center gap-2"
			>
				<div className="relative h-9 w-9 rounded-md overflow-hidden">
					{/* Logo background with gradient */}
					<div className="absolute inset-0 bg-gradient-to-br from-[#4e9815] to-[#0D0C0C] z-10"></div>

					{/* Matrix code overlay */}
					<canvas
						ref={canvasRef}
						className={`absolute inset-0 z-20 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}
					/>

					{/* Logo symbol - improved design */}
					<div className="absolute inset-0 flex items-center justify-center z-30">
						<div className="h-5 w-5 border-2 border-[#0D0C0C] bg-white rounded-sm transform rotate-45 flex items-center justify-center overflow-hidden">
							<div className="h-2 w-2 bg-[#4e9815] rounded-sm transform rotate-45"></div>
						</div>
					</div>

					{/* Glowing effect on hover */}
					<div
						className={`absolute inset-0 bg-[#4e9815] blur-md transition-opacity duration-300 z-0 ${
							isHovered ? 'opacity-50' : 'opacity-0'
						}`}
					></div>
				</div>

				<motion.span
					className="bg-gradient-to-b from-[#F2F0ED] to-[#ADADAD] bg-clip-text text-transparent font-bold text-lg tracking-wider"
					animate={
						isHovered
							? {
									textShadow: [
										'0 0 0px rgba(78, 152, 21, 0)',
										'0 0 10px rgba(78, 152, 21, 0.5)',
										'0 0 0px rgba(78, 152, 21, 0)',
									],
								}
							: {}
					}
					transition={{
						duration: 2,
						repeat: Number.POSITIVE_INFINITY,
					}}
				>
					MATRIX-AUTH
				</motion.span>
			</Link>
		</motion.div>
	)
}
