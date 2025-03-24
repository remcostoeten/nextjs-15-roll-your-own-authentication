'use client'

import { format } from 'date-fns'
import { motion } from 'framer-motion'
import { Badge } from '@/shared/components/ui/badge'
import { cn } from '@/shared/utils/cn'
import { ScrollArea } from '@/shared/components/ui/scroll-area'
import { Card } from '@/shared/components/ui/card'

type Activity = {
	type: 'login' | 'registration' | 'error' | 'system' | 'navigation' | 'auth'
	timestamp: string
	title: string
	metadata: Record<string, any>
	userAgent?: string
}

type ActivityTimelineProps = {
	activities: Activity[]
	className?: string
	maxHeight?: string
}

const typeColors = {
	login: 'bg-emerald-500/10 text-emerald-500 dark:bg-emerald-500/20',
	registration: 'bg-blue-500/10 text-blue-500 dark:bg-blue-500/20',
	error: 'bg-red-500/10 text-red-500 dark:bg-red-500/20',
	system: 'bg-yellow-500/10 text-yellow-500 dark:bg-yellow-500/20',
	navigation: 'bg-purple-500/10 text-purple-500 dark:bg-purple-500/20',
	auth: 'bg-cyan-500/10 text-cyan-500 dark:bg-cyan-500/20',
}

const activityVariants = {
	hidden: { opacity: 0, x: -20 },
	visible: { opacity: 1, x: 0 },
}

export function ActivityTimeline({ activities, className, maxHeight = '600px' }: ActivityTimelineProps) {
	const groupedActivities = activities.reduce(
		(groups, activity) => {
			const date = new Date(activity.timestamp)
			const day = format(date, 'yyyy-MM-dd')

			if (!groups[day]) {
				groups[day] = []
			}
			groups[day].push(activity)
			return groups
		},
		{} as Record<string, Activity[]>
	)

	return (
		<Card className={cn('overflow-hidden', className)}>
			<ScrollArea className={cn('p-4', maxHeight && `max-h-[${maxHeight}]`)}>
				<div className="space-y-8">
					{Object.entries(groupedActivities).map(([day, dayActivities], groupIndex) => (
						<div
							key={day}
							className="relative"
						>
							<div className="sticky top-0 z-10 -mx-4 px-4 py-2 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
								<h3 className="text-sm font-medium text-muted-foreground">
									{format(new Date(day), 'MMMM d, yyyy')}
								</h3>
							</div>
							<div className="space-y-4 mt-4">
								{dayActivities.map((activity, index) => (
									<motion.div
										key={`${activity.timestamp}-${index}`}
										variants={activityVariants}
										initial="hidden"
										animate="visible"
										transition={{
											delay: index * 0.05,
											duration: 0.2,
											ease: 'easeOut',
										}}
										className="relative pl-6 group"
									>
										{/* Timeline line */}
										<div className="absolute left-0 w-px h-full -ml-[2px] bg-border group-hover:bg-primary/50 transition-colors duration-300" />

										{/* Timeline dot */}
										<div className="absolute left-0 w-2 h-2 rounded-full -ml-1 bg-muted-foreground group-hover:bg-primary group-hover:scale-125 transition-all duration-300" />

										{/* Content */}
										<div className="flex flex-col space-y-2 bg-card/50 rounded-lg p-3 hover:bg-card/80 transition-colors duration-300">
											<div className="flex items-center gap-2">
												<Badge
													variant="secondary"
													className={cn('capitalize font-medium', typeColors[activity.type])}
												>
													{activity.type}
												</Badge>
												<span className="text-xs text-muted-foreground font-medium">
													{format(new Date(activity.timestamp), 'HH:mm:ss')}
												</span>
											</div>

											<div className="text-sm font-medium">{activity.title}</div>

											{activity.userAgent && (
												<div className="text-xs text-muted-foreground font-mono bg-muted/30 px-2 py-1 rounded">
													{activity.userAgent}
												</div>
											)}

											{Object.keys(activity.metadata).length > 0 && (
												<pre className="mt-2 p-2 rounded-lg bg-muted/30 text-xs font-mono overflow-x-auto">
													{JSON.stringify(activity.metadata, null, 2)}
												</pre>
											)}
										</div>
									</motion.div>
								))}
							</div>
						</div>
					))}
				</div>
			</ScrollArea>
		</Card>
	)
}
