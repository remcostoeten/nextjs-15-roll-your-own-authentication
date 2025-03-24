'use client'

import type React from 'react'

import { useState, useRef, useEffect } from 'react'

interface MatrixIconProps {
	children: React.ReactNode
	href: string
}

export function MatrixIcon({ children, href }: MatrixIconProps) {
	const [isHovered, setIsHovered] = useState(false)
	const containerRef = useRef<HTMLDivElement>(null)
	const canvasRef = useRef<HTMLCanvasElement>(null)
	const requestRef = useRef<number>()

	// Matrix rain effect
	useEffect(() => {
		if (!isHovered || !canvasRef.current) return

		const canvas = canvasRef.current
		const ctx = canvas.getContext('2d')
		if (!ctx) return

		canvas.width = canvas.offsetWidth
		canvas.height = canvas.offsetHeight

		const fontSize = 8
		const columns = Math.floor(canvas.width / fontSize)
		const drops: number[] = Array(columns).fill(1)

		// Characters for matrix rain
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
		<div
			ref={containerRef}
			className="relative flex items-center justify-center"
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
			style={{
				// Fixed dimensions to prevent layout shifts
				width: '20px',
				height: '20px',
			}}
		>
			<a
				href={href}
				className="relative z-10 flex items-center justify-center"
				target="_blank"
				rel="noopener noreferrer"
				style={{
					// Ensure the link takes up the full space
					width: '100%',
					height: '100%',
				}}
			>
				{children}
			</a>

			{/* Matrix rain canvas */}
			<canvas
				ref={canvasRef}
				className={`absolute inset-0 -z-10 rounded-full opacity-0 transition-opacity duration-300 ${
					isHovered ? 'opacity-50' : ''
				}`}
				aria-hidden="true"
			/>

			{/* Glow effect */}
			<div
				className={`absolute inset-0 -z-20 rounded-full bg-[#0f0] blur-md opacity-0 transition-opacity duration-300 ${
					isHovered ? 'opacity-20' : ''
				}`}
				aria-hidden="true"
			/>
		</div>
	)
}
