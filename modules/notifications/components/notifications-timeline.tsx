'use client'

import type React from 'react'
import Link from 'next/link'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import {
	Check,
	Bell,
	AlertTriangle,
	Info,
	CheckCircle2,
	ExternalLink,
} from 'lucide-react'
import { markNotificationAsRead } from '../api/mutations'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import { toast } from '@/hooks/use-toast'

interface NotificationTimelineProps {
	notifications: any[]
	isLoading?: boolean
	onNotificationUpdate?: (notification: any) => void
	className?: string
}

export function NotificationTimeline({
	notifications,
	isLoading = false,
	onNotificationUpdate,
	className,
}: NotificationTimelineProps) {
	// Group notifications by date
	const groupedNotifications = notifications.reduce(
		(groups: Record<string, any[]>, notification) => {
			const date = new Date(notification.createdAt)
			const dateKey = format(date, 'yyyy-MM-dd')

			if (!groups[dateKey]) {
				groups[dateKey] = []
			}

			groups[dateKey].push(notification)
			return groups
		},
		{}
	)

	// Sort dates in descending order
	const sortedDates = Object.keys(groupedNotifications).sort(
		(a, b) => new Date(b).getTime() - new Date(a).getTime()
	)

	// Mark notification as read
	const handleMarkAsRead = async (id: number, e?: React.MouseEvent) => {
		if (e) e.stopPropagation()

		try {
			await markNotificationAsRead(id)

			const notification = notifications.find((n) => n.id === id)
			if (notification && onNotificationUpdate) {
				onNotificationUpdate({ ...notification, isRead: true })
			}

			toast({
				title: 'Notification marked as read',
				description: 'The notification has been marked as read',
			})
		} catch (error) {
			console.error('Error marking notification as read:', error)
			toast({
				title: 'Action failed',
				description:
					'Could not mark notification as read. Please try again.',
				variant: 'destructive',
			})
		}
	}

	// Get notification type icon
	const getNotificationIcon = (type: string) => {
		switch (type) {
			case 'success':
				return <CheckCircle2 className="h-4 w-4 text-emerald-500" />
			case 'warning':
				return <AlertTriangle className="h-4 w-4 text-amber-500" />
			case 'error':
				return <AlertTriangle className="h-4 w-4 text-rose-500" />
			default:
				return <Info className="h-4 w-4 text-sky-500" />
		}
	}

	const getNotificationTypeStyles = (type: string) => {
		switch (type) {
			case 'success':
				return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400'
			case 'warning':
				return 'bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400'
			case 'error':
				return 'bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-400'
			default:
				return 'bg-sky-50 text-sky-700 dark:bg-sky-950/50 dark:text-sky-400'
		}
	}

	// Get initials from name
	const getInitials = (firstName: string, lastName: string) => {
		return `${firstName[0]}${lastName[0]}`.toUpperCase()
	}

	// Format date for display
	const formatDateDisplay = (dateStr: string) => {
		const date = new Date(dateStr)
		const today = new Date()
		const yesterday = new Date(today)
		yesterday.setDate(yesterday.getDate() - 1)

		if (date.toDateString() === today.toDateString()) {
			return 'Today'
		} else if (date.toDateString() === yesterday.toDateString()) {
			return 'Yesterday'
		} else {
			return format(date, 'MMMM d, yyyy')
		}
	}

	return (
		<div className={cn('flex flex-col', className)}>
			<div className="flex items-center justify-between border-b p-4">
				<div className="flex items-center gap-2">
					<h2 className="text-lg font-semibold">Timeline</h2>
					<Badge
						variant="secondary"
						className="ml-1"
					>
						{notifications.length}
					</Badge>
				</div>
			</div>

			{isLoading ? (
				<div className="space-y-8 p-4">
					{[1, 2, 3].map((i) => (
						<div
							key={i}
							className="flex flex-col"
						>
							<Skeleton className="h-5 w-32 mb-4" />
							<div className="space-y-4">
								<div className="flex items-start gap-3">
									<Skeleton className="h-10 w-10 rounded-full flex-shrink-0" />
									<div className="space-y-2 flex-1">
										<Skeleton className="h-4 w-full" />
										<Skeleton className="h-3 w-4/5" />
										<Skeleton className="h-3 w-2/5" />
									</div>
								</div>
								<div className="flex items-start gap-3">
									<Skeleton className="h-10 w-10 rounded-full flex-shrink-0" />
									<div className="space-y-2 flex-1">
										<Skeleton className="h-4 w-full" />
										<Skeleton className="h-3 w-4/5" />
									</div>
								</div>
							</div>
						</div>
					))}
				</div>
			) : notifications.length > 0 ? (
				<div className="divide-y">
					{sortedDates.map((dateKey) => (
						<div
							key={dateKey}
							className="p-4"
						>
							<h3 className="text-sm font-medium text-muted-foreground mb-4">
								{formatDateDisplay(dateKey)}
							</h3>

							<div className="relative border-l-2 border-muted pl-6 space-y-6">
								{groupedNotifications[dateKey].map(
									(notification) => (
										<div
											key={notification.id}
											className={cn(
												'relative',
												!notification.isRead &&
													'font-medium'
											)}
										>
											{/* Timeline dot */}
											<div
												className={cn(
													'absolute -left-[25px] top-0 h-4 w-4 rounded-full border-2 border-background',
													notification.isRead
														? 'bg-muted'
														: 'bg-primary'
												)}
											/>

											<div className="flex items-start gap-4 rounded-lg border p-3 hover:bg-muted/50 transition-colors">
												<Avatar className="h-10 w-10 border flex-shrink-0 ring-2 ring-background">
													{notification.creator
														.avatarUrl ? (
														<AvatarImage
															src={
																notification
																	.creator
																	.avatarUrl
															}
															alt={`${notification.creator.firstName} ${notification.creator.lastName}`}
														/>
													) : (
														<AvatarFallback
															className={cn(
																'text-sm font-medium',
																getNotificationTypeStyles(
																	notification.type
																)
															)}
														>
															{getInitials(
																notification
																	.creator
																	.firstName,
																notification
																	.creator
																	.lastName
															)}
														</AvatarFallback>
													)}
												</Avatar>

												<div className="flex-1 space-y-1.5 min-w-0">
													<div className="flex items-start justify-between gap-2">
														<div className="flex items-center gap-2 flex-wrap">
															{getNotificationIcon(
																notification.type
															)}
															<p className="line-clamp-1 text-sm">
																{
																	notification.title
																}
															</p>
														</div>

														<div className="text-xs text-muted-foreground">
															{format(
																new Date(
																	notification.createdAt
																),
																'h:mm a'
															)}
														</div>
													</div>

													<p className="text-sm text-muted-foreground">
														{notification.content}
													</p>

													<div className="flex items-center gap-2 pt-1.5">
														{notification.link && (
															<Button
																asChild
																variant="outline"
																size="sm"
																className="h-7 text-xs font-medium gap-1"
															>
																<Link
																	href={
																		notification.link
																	}
																>
																	View Details
																	<ExternalLink className="ml-1 h-3 w-3" />
																</Link>
															</Button>
														)}

														{!notification.isRead && (
															<Button
																variant="ghost"
																size="sm"
																className="h-7 px-2 text-xs font-medium hover:bg-primary/10 hover:text-primary"
																onClick={(e) =>
																	handleMarkAsRead(
																		notification.id,
																		e
																	)
																}
															>
																<Check className="mr-1 h-3 w-3" />
																Mark as read
															</Button>
														)}
													</div>
												</div>
											</div>
										</div>
									)
								)}
							</div>
						</div>
					))}
				</div>
			) : (
				<div className="flex flex-col items-center justify-center py-12 px-4 text-center">
					<div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted mb-4">
						<Bell className="h-6 w-6 text-muted-foreground" />
					</div>
					<h3 className="font-medium mb-1">No notifications</h3>
					<p className="text-muted-foreground text-sm max-w-sm">
						When you receive notifications, they'll appear here in a
						timeline view.
					</p>
				</div>
			)}
		</div>
	)
}
