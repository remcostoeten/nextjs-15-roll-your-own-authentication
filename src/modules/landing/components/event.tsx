'use client'

import { motion } from 'framer-motion'
import { type ReactNode, useState } from 'react'

export type TActivityItem = {
	title?: string
	icon?: ReactNode
	analyticsDetails?: string
	detailsIcon?: ReactNode
}

/**
 * Displays an event item with an icon and title, revealing additional analytics details and a details icon on hover with animated transitions.
 *
 * @param title - The main event title to display.
 * @param icon - The icon shown alongside the event title.
 * @param analyticsDetails - Additional details shown when the item is hovered.
 * @param detailsIcon - Icon displayed with the analytics details.
 *
 * @remark
 * The `forceHover` prop is accepted but not currently used; hover state is controlled by mouse events.
 */
export function EventItem({
	title = 'Last connection from DR Congo',
	icon = '🇨🇩',
	analyticsDetails = 'Resolved via IP lookup (Berlin, Germany)',
	detailsIcon = '🇩🇪',
}: TActivityItem & { forceHover?: boolean }) {
	const [hovered, setHovered] = useState(false)

	return (
		<div
			onMouseEnter={() => setHovered(true)}
			onMouseLeave={() => setHovered(false)}
			className="flex w-fit flex-col items-start gap-1"
		>
			<motion.div
				animate={{ y: hovered ? -6 : 0 }}
				transition={{
					duration: 0.4,
					ease: [0.19, 1, 0.22, 1],
				}}
				className="flex items-center gap-2 rounded-md border bg-background px-3 py-1 text-xs font-medium shadow-md shadow-zinc-950/5 dark:bg-muted"
			>
				<span className="text-lg">{icon}</span>
				{title}
			</motion.div>

			<motion.div
				initial={false}
				animate={{
					opacity: hovered ? 1 : 0,
					y: hovered ? 0 : 6,
					height: hovered ? 'auto' : 0,
				}}
				transition={{
					duration: 0.4,
					ease: [0.19, 1, 0.22, 1],
				}}
				className="overflow-hidden rounded-md border bg-background px-3 py-1 text-xs font-medium shadow-md shadow-zinc-950/5 dark:bg-muted"
			>
				<div className="flex items-center gap-2">
					<span className="text-lg">{detailsIcon}</span>
					{analyticsDetails}
				</div>
			</motion.div>
		</div>
	)
}
