'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Terminal } from 'lucide-react'
import { useScrambleText } from '@/hooks/use-scrambletext'

export function LoginButton() {
	const [isHovered, setIsHovered] = useState(false)
	const canvasRef = useRef<HTMLCanvasElement>(null)
	const requestRef = useRef<number | null>(null)

	const { displayText, scramble, reset } = useScrambleText('Login')

	useEffect(() => {
		if (isHovered) {
			scramble()
		} else {
			reset()
		}
	}, [isHovered, scramble, reset])

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
		const matrixChars = '01'

		const drawMatrixRain = () => {
			ctx.fillStyle = 'rgba(13, 12, 12, 0.1)'
			ctx.fillRect(0, 0, canvas.width, canvas.height)
			ctx.fillStyle = '#0f0'
			ctx.font = `${fontSize}px monospace`

			for (let i = 0; i < drops.length; i++) {
				const char =
					matrixChars[Math.floor(Math.random() * matrixChars.length)]
				ctx.fillText(char, i * fontSize, drops[i] * fontSize)
				if (
					drops[i] * fontSize > canvas.height &&
					Math.random() > 0.95
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

	return (
		<Link href='/login'>
			<motion.div
				className='relative group'
				onMouseEnter={() => setIsHovered(true)}
				onMouseLeave={() => setIsHovered(false)}
				initial={{ opacity: 1 }}
			>
				<div className='absolute inset-0 rounded-md overflow-hidden'>
					<canvas
						ref={canvasRef}
						className='w-full h-full opacity-0 group-hover:opacity-20 transition-opacity duration-300'
					/>
				</div>

				<div className='absolute -inset-0.5 bg-gradient-to-r from-[#4e9815]/30 to-[#4e9815]/10 rounded-md blur opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>

				<div className='relative flex items-center gap-2 px-4 py-1.5 rounded-md border border-[#4e9815]/30 bg-[#0D0C0C] text-[#4e9815] transition-all duration-200'>
					{/* Use displayText from the hook */}
					<span className='font-mono'>{displayText}</span>
					<span className='text-xs opacity-70 font-mono ml-1'>
						[ctrl+l]
					</span>

					<motion.span
						className='h-3.5 w-0.5 bg-[#4e9815] opacity-0 group-hover:opacity-70'
						animate={{ opacity: [0, 0.7, 0] }}
						transition={{
							duration: 1,
							repeat: Number.POSITIVE_INFINITY
						}}
					></motion.span>
				</div>

				<motion.div
					className='absolute inset-0 rounded-md border border-[#4e9815]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300'
					animate={
						isHovered
							? {
									borderColor: [
										'rgba(78, 152, 21, 0)',
										'rgba(78, 152, 21, 0.5)',
										'rgba(78, 152, 21, 0)'
									],
									boxShadow: [
										'0 0 0px rgba(78, 152, 21, 0)',
										'0 0 10px rgba(78, 152, 21, 0.3)',
										'0 0 0px rgba(78, 152, 21, 0)'
									]
								}
							: {}
					}
					transition={{
						duration: 2,
						repeat: Number.POSITIVE_INFINITY
					}}
				/>
			</motion.div>
		</Link>
	)
}
