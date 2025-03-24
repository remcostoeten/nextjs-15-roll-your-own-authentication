import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue } from 'framer-motion'
import { addMonths, format, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import { cn } from 'helpers'

interface TimelineProps {
	items: any[]
	onItemClick: (item: any) => void
	timeframe?: 'DAY' | 'WEEK' | 'MONTH' | 'QUARTER' | 'HALF_YEAR' | 'YEAR'
}

export function Timeline({ items = [], onItemClick, timeframe = 'MONTH' }: TimelineProps) {
	const [currentDate, setCurrentDate] = useState(new Date())
	const [isDragging, setIsDragging] = useState(false)
	const containerRef = useRef<HTMLDivElement>(null)
	const x = useMotionValue(0)
	const scale = useMotionValue(1)

	// Calculate timeline dates based on timeframe
	const startDate = startOfMonth(currentDate)
	const endDate = endOfMonth(currentDate)
	const days = eachDayOfInterval({ start: startDate, end: endDate })

	// Handle zoom with ctrl + wheel
	useEffect(() => {
		const handleWheel = (e: WheelEvent) => {
			if (e.ctrlKey) {
				e.preventDefault()
				const newScale = Math.min(Math.max(scale.get() - e.deltaY * 0.001, 0.5), 2)
				scale.set(newScale)
			}
		}

		const container = containerRef.current
		if (container) {
			container.addEventListener('wheel', handleWheel, { passive: false })
			return () => container.removeEventListener('wheel', handleWheel)
		}
	}, [scale])

	const handleDragStart = () => setIsDragging(true)
	const handleDragEnd = () => setIsDragging(false)

	const navigateMonth = (direction: 'prev' | 'next') => {
		setCurrentDate((prev) => addMonths(prev, direction === 'next' ? 1 : -1))
	}

	return (
		<div className="w-full space-y-4">
			<div className="flex items-center justify-between">
				<div className="flex items-center space-x-2">
					<Button
						variant="outline"
						size="icon"
						onClick={() => navigateMonth('prev')}
					>
						<ChevronLeft className="h-4 w-4" />
					</Button>
					<h3 className="text-lg font-semibold">{format(currentDate, 'MMMM yyyy')}</h3>
					<Button
						variant="outline"
						size="icon"
						onClick={() => navigateMonth('next')}
					>
						<ChevronRight className="h-4 w-4" />
					</Button>
				</div>

				<div className="flex items-center space-x-2">
					{['DAY', 'WEEK', 'MONTH', 'QUARTER', 'HALF_YEAR', 'YEAR'].map((tf) => (
						<Button
							key={tf}
							variant={timeframe === tf ? 'default' : 'outline'}
							size="sm"
							onClick={() => {
								/* TODO: Implement timeframe change */
							}}
						>
							{tf.charAt(0) + tf.slice(1).toLowerCase()}
						</Button>
					))}
				</div>
			</div>

			<div
				ref={containerRef}
				className="relative overflow-hidden border rounded-lg"
				style={{ height: 'calc(100vh - 300px)' }}
			>
				<motion.div
					className="relative h-full"
					drag="x"
					dragConstraints={containerRef}
					onDragStart={handleDragStart}
					onDragEnd={handleDragEnd}
					style={{ x, scale }}
				>
					{/* Timeline header */}
					<div className="sticky top-0 z-10 flex border-b bg-background/95 backdrop-blur">
						{days.map((day) => (
							<div
								key={day.toISOString()}
								className="flex-shrink-0 w-32 p-2 text-center border-r"
							>
								<div className="text-sm font-medium">{format(day, 'EEE')}</div>
								<div className="text-sm text-muted-foreground">{format(day, 'd')}</div>
							</div>
						))}
					</div>

					{/* Timeline content */}
					<div className="relative">
						{/* Current time indicator */}
						<div
							className="absolute top-0 bottom-0 w-0.5 bg-primary"
							style={{
								left: `${(new Date().getDate() - 1) * 128}px`,
							}}
						/>

						{/* Timeline items */}
						{items.map((item) => (
							<motion.div
								key={item.id}
								className={cn(
									'absolute p-2 rounded-lg border',
									!isDragging && 'cursor-pointer hover:shadow-md transition-shadow'
								)}
								style={{
									top: `${item.row * 80}px`,
									left: `${(new Date(item.startDate).getDate() - 1) * 128}px`,
									width: `${(new Date(item.endDate).getDate() - new Date(item.startDate).getDate() + 1) * 128}px`,
									backgroundColor: item.color || 'var(--primary)',
								}}
								onClick={() => !isDragging && onItemClick(item)}
								whileHover={{ y: -2 }}
								transition={{ duration: 0.2 }}
							>
								<div className="text-sm font-medium text-white truncate">{item.title}</div>
								<div className="text-xs text-white/80">{item.progress}% complete</div>
							</motion.div>
						))}
					</div>
				</motion.div>
			</div>
		</div>
	)
}
