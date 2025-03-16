'use client'

import React, { useState, useRef } from 'react'
import { cn } from '@/shared/utils/cn'

interface ResizableProps {
	children: React.ReactNode
	className?: string
	minWidth?: number
	minHeight?: number
	defaultWidth?: number
	defaultHeight?: number
	onResize?: (width: number, height: number) => void
	style?: React.CSSProperties
}

const ResizeHandle = ({
	className,
	...props
}: React.HTMLAttributes<HTMLDivElement>) => (
	<div
		className={cn(
			'absolute w-3 h-3 bg-primary/80 rounded-full cursor-pointer border-2 border-background',
			'transform-gpu hover:scale-110 transition-all duration-150 ease-out',
			"after:content-[''] after:absolute after:inset-0 after:rounded-full after:bg-primary/20 after:scale-0 after:opacity-0 hover:after:scale-150 hover:after:opacity-100 after:transition-all after:duration-300 after:ease-out",
			className
		)}
		{...props}
	/>
)

export const Resizable = ({
	children,
	className,
	minWidth = 200,
	minHeight = 100,
	defaultWidth = 300,
	defaultHeight = 200,
	onResize,
	...props
}: ResizableProps) => {
	const [dimensions, setDimensions] = useState({
		width: defaultWidth,
		height: defaultHeight,
	})
	const containerRef = useRef<HTMLDivElement>(null)
	const [isResizing, setIsResizing] = useState(false)
	const resizeStartPos = useRef({ x: 0, y: 0 })
	const originalDimensions = useRef({ width: 0, height: 0 })

	const handleResizeStart = (
		e: React.MouseEvent | MouseEvent,
		corner: string
	) => {
		e.preventDefault()
		setIsResizing(true)
		resizeStartPos.current = { x: e.clientX, y: e.clientY }
		originalDimensions.current = { ...dimensions }

		const handleMouseMove = (e: MouseEvent) => {
			if (!isResizing) return
			requestAnimationFrame(() => {
				let deltaX = e.clientX - resizeStartPos.current.x
				let deltaY = e.clientY - resizeStartPos.current.y

				if (corner.includes('left')) deltaX *= -1
				if (corner.includes('top')) deltaY *= -1

				const newWidth = Math.max(
					originalDimensions.current.width + deltaX,
					minWidth
				)
				const newHeight = Math.max(
					originalDimensions.current.height + deltaY,
					minHeight
				)

				setDimensions({ width: newWidth, height: newHeight })
				onResize?.(newWidth, newHeight)
			})
		}

		const handleMouseUp = () => {
			setIsResizing(false)
			document.removeEventListener('mousemove', handleMouseMove)
			document.removeEventListener('mouseup', handleMouseUp)
		}

		document.addEventListener('mousemove', handleMouseMove)
		document.addEventListener('mouseup', handleMouseUp)
	}

	return (
		<div
			ref={containerRef}
			className={cn(
				'relative transition-[border] duration-200',
				isResizing && 'select-none',
				className
			)}
			style={{
				width: dimensions.width,
				height: dimensions.height,
				transition: isResizing
					? 'none'
					: 'width 0.2s ease-out, height 0.2s ease-out',
			}}
			{...props}
		>
			<div className="w-full h-full">{children}</div>

			{/* Corner handles */}
			<ResizeHandle
				className="top-0 left-0 -translate-x-1/2 -translate-y-1/2 cursor-nw-resize"
				onMouseDown={(e) => handleResizeStart(e, 'top-left')}
			/>
			<ResizeHandle
				className="top-0 right-0 translate-x-1/2 -translate-y-1/2 cursor-ne-resize"
				onMouseDown={(e) => handleResizeStart(e, 'top-right')}
			/>
			<ResizeHandle
				className="bottom-0 left-0 -translate-x-1/2 translate-y-1/2 cursor-sw-resize"
				onMouseDown={(e) => handleResizeStart(e, 'bottom-left')}
			/>
			<ResizeHandle
				className="bottom-0 right-0 translate-x-1/2 translate-y-1/2 cursor-se-resize"
				onMouseDown={(e) => handleResizeStart(e, 'bottom-right')}
			/>
		</div>
	)
}
