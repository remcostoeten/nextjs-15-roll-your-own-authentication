'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { scrambleText, CharacterSets } from 'helpers'

type TProps = {
	href: string
	text: string
	isActive: boolean
}

export function MatrixMenuItem({ href, text, isActive }: TProps) {
	const [isHovered, setIsHovered] = useState(false)
	const [scrambledText, setScrambledText] = useState(text)
	const canvasRef = useRef<HTMLCanvasElement>(null)
	const requestRef = useRef<number>()
	const intervalRef = useRef<NodeJS.Timeout>()

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

		const drawMatrixRain = () => {
			ctx.fillStyle = 'rgba(13, 12, 12, 0.05)'
			ctx.fillRect(0, 0, canvas.width, canvas.height)

			ctx.fillStyle = '#0f0'
			ctx.font = `${fontSize}px monospace`

			for (let i = 0; i < drops.length; i++) {
				const char = scrambleText(1, CharacterSets.MATRIX)

				ctx.fillText(char, i * fontSize, drops[i] * fontSize)

				if (
					drops[i] * fontSize > canvas.height &&
					Math.random() > 0.975
				) {
					drops[i] = 0
				}

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

	// Text scrambling effect
	useEffect(() => {
		if (!isHovered) {
			setScrambledText(text)
			return
		}

		let iteration = 0
		const maxIterations = 10 // Number of iterations before settling on the final text

		intervalRef.current = setInterval(() => {
			setScrambledText((prevText) => {
				const correctChars = Math.floor(
					(iteration / maxIterations) * text.length
				)

				return text
					.split('')
					.map((char, idx) => {
						if (char === ' ') return ' '

						if (idx < correctChars) return text[idx]

						return scrambleText(1, CharacterSets.MATRIX)
					})
					.join('')
			})

			if (iteration >= maxIterations) {
				clearInterval(intervalRef.current)
				setScrambledText(text)
			}

			iteration++
		}, 50)

		return () => {
			if (intervalRef.current) {
				clearInterval(intervalRef.current)
			}
		}
	}, [isHovered, text])

	return (
		<motion.div
			className="relative"
			onHoverStart={() => setIsHovered(true)}
			onHoverEnd={() => setIsHovered(false)}
			whileHover={{ scale: 1.05 }}
		>
			<Link
				href={href}
				className={`relative z-10 text-sm transition-colors duration-200 ${
					isActive ? 'text-white' : 'text-[#8C877D] hover:text-white'
				}`}
			>
				{scrambledText}
			</Link>

			{/* Matrix rain canvas */}
			<canvas
				ref={canvasRef}
				className={`absolute inset-0 -z-10 rounded opacity-0 transition-opacity duration-300 ${
					isHovered ? 'opacity-30' : ''
				}`}
				aria-hidden="true"
			/>

			{/* Glow effect */}
			<div
				className={`absolute inset-0 -z-20 rounded-full bg-[#0f0] blur-xl opacity-0 transition-opacity duration-300 ${
					isHovered ? 'opacity-10' : ''
				}`}
				aria-hidden="true"
			/>
		</motion.div>
	)
}
