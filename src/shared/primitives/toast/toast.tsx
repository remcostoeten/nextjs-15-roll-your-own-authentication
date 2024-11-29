'use client'

import { motion, type HTMLMotionProps } from 'framer-motion'
import {
	AlertCircle,
	CheckCircle,
	Info,
	Loader2,
	X,
	XCircle
} from 'lucide-react'
import * as React from 'react'
import { useEffect, useMemo, useState } from 'react'
import { ANIMATIONS, DEFAULT_DURATION, POSITION_STYLES } from './constants'
import type { ToastProps } from './types'

type MotionDivProps = HTMLMotionProps<'div'> & {
	className?: string
	style?: React.CSSProperties
}

const MotionDiv = motion.div as React.ComponentType<MotionDivProps>

/**
 * Toast notification component
 * @author Remco Stoeten
 */
export default function Toast({
	id,
	message,
	description,
	variant = 'info',
	position = 'bottom-right',
	duration = DEFAULT_DURATION,
	animation = 'slide',
	showProgress = true,
	showSpinner = false,
	isPending = false,
	onRemove
}: ToastProps) {
	const [progress, setProgress] = useState(100)

	useEffect(() => {
		if (!isPending && duration) {
			const timer = setTimeout(() => onRemove?.(id), duration)

			if (showProgress) {
				const interval = setInterval(() => {
					setProgress((prev) => {
						const next = prev - 100 / (duration / 100)
						return next < 0 ? 0 : next
					})
				}, 100)

				return () => {
					clearTimeout(timer)
					clearInterval(interval)
				}
			}

			return () => clearTimeout(timer)
		}
	}, [duration, id, isPending, onRemove, showProgress])

	const Icon = useMemo(() => {
		switch (variant) {
			case 'success':
				return CheckCircle
			case 'error':
				return XCircle
			case 'warning':
				return AlertCircle
			case 'info':
				return Info
			default:
				return null
		}
	}, [variant])

	return (
		<MotionDiv
			layout
			initial={ANIMATIONS[animation].initial}
			animate={ANIMATIONS[animation].animate}
			exit={ANIMATIONS[animation].exit}
			className={`fixed pointer-events-auto select-none ${POSITION_STYLES[position]}`}
		>
			<div
				className={`
          flex w-full items-center gap-3 rounded-lg bg-zinc-900 p-4 text-white shadow-lg
          border border-zinc-800 min-w-[320px] max-w-[520px]
          ${variant === 'success' && 'border-green-800'}
          ${variant === 'error' && 'border-red-800'}
          ${variant === 'warning' && 'border-yellow-800'}
          ${variant === 'info' && 'border-blue-800'}
        `}
			>
				{showSpinner && isPending ? (
					<Loader2 className="h-5 w-5 animate-spin" />
				) : (
					Icon && (
						<Icon
							className={`
              h-5 w-5
              ${variant === 'success' && 'text-green-400'}
              ${variant === 'error' && 'text-red-400'}
              ${variant === 'warning' && 'text-yellow-400'}
              ${variant === 'info' && 'text-blue-400'}
            `}
						/>
					)
				)}

				<div className="flex-1">
					<p className="font-medium leading-none tracking-tight">
						{message}
					</p>
					{description && (
						<p className="mt-1 text-sm text-zinc-400">
							{description}
						</p>
					)}
				</div>

				{!isPending && (
					<button
						onClick={() => onRemove?.(id)}
						className="text-zinc-400 hover:text-white transition-colors"
						type="button"
					>
						<X className="h-5 w-5" />
					</button>
				)}

				{showProgress && !isPending && (
					<div className="absolute bottom-0 left-0 right-0 h-1 bg-zinc-800 rounded-b-lg overflow-hidden">
						<div
							className={`
                h-full transition-all duration-100 ease-linear
                ${variant === 'success' && 'bg-green-400/20'}
                ${variant === 'error' && 'bg-red-400/20'}
                ${variant === 'warning' && 'bg-yellow-400/20'}
                ${variant === 'info' && 'bg-blue-400/20'}
              `}
							style={{ width: `${progress}%` }}
						/>
					</div>
				)}
			</div>
		</MotionDiv>
	)
}
