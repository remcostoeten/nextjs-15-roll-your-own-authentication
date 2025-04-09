'use client'

import type React from 'react'

import { useState } from 'react'
import Link from 'next/link'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import {
	Check,
	ChevronDown,
	ChevronUp,
	Bell,
	AlertTriangle,
	Info,
	CheckCircle2,
	MoreHorizontal,
	Trash2,
	Archive,
	Share2,
	ExternalLink,
} from 'lucide-react'
import { markNotificationAsRead } from '../api/mutations'
import { cn } from '@/lib/utils'
import { formatDistanceToNow } from 'date-fns'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { toast } from '@/hooks/use-toast'
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/components/ui/tooltip'

interface NotificationListProps {
	notifications: any[]
	isLoading?: boolean
	onRefresh?: () => void
	onNotificationUpdate?: (notification: any) => void
	showViewAll?: boolean
	className?: string
}

export function NotificationList({
	notifications,
	isLoading = false,
	onRefresh,
	onNotificationUpdate,
	showViewAll = false,
	className,
}: NotificationListProps) {
	const [expandedNotifications, setExpandedNotifications] = useState<
		number[]
	>([])
	const [selectedNotifications, setSelectedNotifications] = useState<
		number[]
	>([])
	const [selectMode, setSelectMode] = useState(false)

	// Toggle notification expansion
	const toggleExpand = (id: number) => {
		if (selectMode) {
			toggleSelect(id)
			return
		}
		setExpandedNotifications((prev) =>
			prev.includes(id)
				? prev.filter((item) => item !== id)
				: [...prev, id]
		)
	}

	// Toggle notification selection
	const toggleSelect = (id: number) => {
		setSelectedNotifications((prev) =>
			prev.includes(id)
				? prev.filter((item) => item !== id)
				: [...prev, id]
		)
	}

	// Toggle select mode
	const toggleSelectMode = () => {
		setSelectMode(!selectMode)
		if (selectMode) {
			setSelectedNotifications([])
		}
	}

	// Select all notifications
	const selectAll = () => {
		if (selectedNotifications.length === notifications.length) {
			setSelectedNotifications([])
		} else {
			setSelectedNotifications(notifications.map((n) => n.id))
		}
	}

	// Mark notification as read
	const handleMarkAsRead = async (id: number, e?: React.MouseEvent) => {
		if (e) e.stopPropagation()

		try {
			await markNotificationAsRead(id)

			const updatedNotification = notifications.find((n) => n.id === id)
			if (updatedNotification) {
				const updated = { ...updatedNotification, isRead: true }
				if (onNotificationUpdate) {
					onNotificationUpdate(updated)
				}
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

	// Mark selected notifications as read
	const markSelectedAsRead = async () => {
		try {
			await Promise.all(
				selectedNotifications.map((id) => markNotificationAsRead(id))
			)

			if (onRefresh) {
				onRefresh()
			} else if (onNotificationUpdate) {
				selectedNotifications.forEach((id) => {
					const notification = notifications.find((n) => n.id === id)
					if (notification) {
						onNotificationUpdate({ ...notification, isRead: true })
					}
				})
			}

			toast({
				title: 'Notifications marked as read',
				description: `${selectedNotifications.length} notification${
					selectedNotifications.length !== 1 ? 's' : ''
				} marked as read`,
			})

			setSelectedNotifications([])
			setSelectMode(false)
		} catch (error) {
			console.error('Error marking notifications as read:', error)
			toast({
				title: 'Action failed',
				description:
					'Could not mark notifications as read. Please try again.',
				variant: 'destructive',
			})
		}
	}

	// Format date
	const formatDate = (date: string) => {
		return formatDistanceToNow(new Date(date), { addSuffix: true })
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

	// Get notification type styles
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

	// Get notification type badge
	const getNotificationTypeBadge = (type: string) => {
		switch (type) {
			case 'success':
				return (
					<Badge
						variant="outline"
						className="bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-400 dark:border-emerald-800"
					>
						Success
					</Badge>
				)
			case 'warning':
				return (
					<Badge
						variant="outline"
						className="bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/50 dark:text-amber-400 dark:border-amber-800"
					>
						Warning
					</Badge>
				)
			case 'error':
				return (
					<Badge
						variant="outline"
						className="bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/50 dark:text-rose-400 dark:border-rose-800"
					>
						Error
					</Badge>
				)
			default:
				return (
					<Badge
						variant="outline"
						className="bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/50 dark:text-sky-400 dark:border-sky-800"
					>
						Info
					</Badge>
				)
		}
	}

	// Get initials from name
	const getInitials = (firstName: string, lastName: string) => {
		return `${firstName[0]}${lastName[0]}`.toUpperCase()
	}

	return (
		<div className={cn('flex flex-col', className)}>
			<div className="flex items-center justify-between border-b p-4">
				<div className="flex items-center gap-2">
					<h2 className="text-lg font-semibold">Inbox</h2>
					<Badge
						variant="secondary"
						className="ml-1"
					>
						{notifications.length}
					</Badge>
				</div>

				<div className="flex items-center gap-2">
					<TooltipProvider>
						<Tooltip>
							<TooltipTrigger asChild>
								<Button
									variant="ghost"
									size="sm"
									onClick={toggleSelectMode}
									className={cn(
										'h-8 w-8 p-0',
										selectMode &&
											'bg-primary/10 text-primary'
									)}
								>
									<Checkbox
										checked={selectMode}
										className="h-4 w-4"
									/>
									<span className="sr-only">Select mode</span>
								</Button>
							</TooltipTrigger>
							<TooltipContent>
								{selectMode
									? 'Exit selection mode'
									: 'Enter selection mode'}
							</TooltipContent>
						</Tooltip>
					</TooltipProvider>

					{selectMode && (
						<>
							<TooltipProvider>
								<Tooltip>
									<TooltipTrigger asChild>
										<Button
											variant="ghost"
											size="sm"
											onClick={selectAll}
											className="h-8 w-8 p-0"
										>
											<Checkbox
												checked={
													selectedNotifications.length ===
														notifications.length &&
													notifications.length > 0
												}
												className="h-4 w-4"
											/>
											<span className="sr-only">
												Select all
											</span>
										</Button>
									</TooltipTrigger>
									<TooltipContent>
										{selectedNotifications.length ===
											notifications.length &&
										notifications.length > 0
											? 'Deselect all'
											: 'Select all'}
									</TooltipContent>
								</Tooltip>
							</TooltipProvider>

							<Button
								variant="outline"
								size="sm"
								onClick={markSelectedAsRead}
								disabled={selectedNotifications.length === 0}
								className="h-8 gap-1.5 text-xs"
							>
								<Check className="h-3.5 w-3.5" />
								Mark Read
							</Button>
						</>
					)}
				</div>
			</div>

			{isLoading ? (
				<div className="space-y-4 p-4">
					{[1, 2, 3].map((i) => (
						<div
							key={i}
							className="flex items-start gap-3"
						>
							<Skeleton className="h-10 w-10 rounded-full flex-shrink-0" />
							<div className="space-y-2 flex-1">
								<Skeleton className="h-4 w-full" />
								<Skeleton className="h-3 w-4/5" />
								<Skeleton className="h-3 w-2/5" />
							</div>
						</div>
					))}
				</div>
			) : notifications.length > 0 ? (
				<div className="divide-y">
					{notifications.map((notification) => (
						<div
							key={notification.id}
							className={cn(
								'relative p-4 transition-colors hover:bg-muted/50 cursor-pointer',
								!notification.isRead && 'bg-muted/30',
								expandedNotifications.includes(
									notification.id
								) && 'bg-muted/40',
								selectedNotifications.includes(
									notification.id
								) && 'bg-primary/5 hover:bg-primary/10'
							)}
							onClick={() => toggleExpand(notification.id)}
						>
							{!notification.isRead && (
								<span className="absolute left-0 top-1/2 h-10 w-1 -translate-y-1/2 rounded-r-full bg-primary" />
							)}

							<div className="flex items-start gap-4">
								{selectMode && (
									<div className="flex items-center h-10 mt-0.5">
										<Checkbox
											checked={selectedNotifications.includes(
												notification.id
											)}
											onCheckedChange={() =>
												toggleSelect(notification.id)
											}
											onClick={(e) => e.stopPropagation()}
											className="h-4 w-4"
										/>
									</div>
								)}
								<Avatar className="h-10 w-10 border flex-shrink-0">
									{notification.creator.avatarUrl ? (
										<AvatarImage
											src={notification.creator.avatarUrl}
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
												notification.creator.firstName,
												notification.creator.lastName
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
											<p
												className={cn(
													'font-medium line-clamp-1 text-sm',
													!notification.isRead &&
														'font-semibold'
												)}
											>
												{notification.title}
											</p>
											{getNotificationTypeBadge(
												notification.type
											)}
										</div>

										<div className="flex items-center gap-2">
											{!notification.isRead && (
												<span className="h-2 w-2 rounded-full bg-primary flex-shrink-0" />
											)}

											<DropdownMenu>
												<DropdownMenuTrigger
													asChild
													onClick={(e) =>
														e.stopPropagation()
													}
												>
													<Button
														variant="ghost"
														size="sm"
														className="h-8 w-8 p-0"
													>
														<MoreHorizontal className="h-4 w-4" />
														<span className="sr-only">
															More options
														</span>
													</Button>
												</DropdownMenuTrigger>
												<DropdownMenuContent align="end">
													{!notification.isRead && (
														<DropdownMenuItem
															onClick={(e) => {
																e.stopPropagation()
																handleMarkAsRead(
																	notification.id
																)
															}}
														>
															<Check className="mr-2 h-4 w-4" />
															Mark as read
														</DropdownMenuItem>
													)}
													<DropdownMenuItem
														onClick={(e) =>
															e.stopPropagation()
														}
													>
														<Archive className="mr-2 h-4 w-4" />
														Archive
													</DropdownMenuItem>
													<DropdownMenuItem
														onClick={(e) =>
															e.stopPropagation()
														}
													>
														<Share2 className="mr-2 h-4 w-4" />
														Share
													</DropdownMenuItem>
													<DropdownMenuSeparator />
													<DropdownMenuItem
														onClick={(e) =>
															e.stopPropagation()
														}
														className="text-destructive focus:text-destructive"
													>
														<Trash2 className="mr-2 h-4 w-4" />
														Delete
													</DropdownMenuItem>
												</DropdownMenuContent>
											</DropdownMenu>

											{expandedNotifications.includes(
												notification.id
											) ? (
												<ChevronUp className="h-4 w-4 text-muted-foreground" />
											) : (
												<ChevronDown className="h-4 w-4 text-muted-foreground" />
											)}
										</div>
									</div>

									<p
										className={cn(
											'text-sm text-muted-foreground',
											!expandedNotifications.includes(
												notification.id
											) && 'line-clamp-1'
										)}
									>
										{notification.content}
									</p>

									<div className="flex items-center justify-between text-xs text-muted-foreground pt-1">
										<div className="flex items-center gap-2">
											<span className="font-medium">
												{formatDate(
													notification.createdAt
												)}
											</span>
											<span className="text-muted-foreground">
												•
											</span>
											<span className="text-muted-foreground">
												{notification.creator.firstName}{' '}
												{notification.creator.lastName}
											</span>
										</div>

										{!notification.isRead &&
											!expandedNotifications.includes(
												notification.id
											) && (
												<Button
													variant="ghost"
													size="sm"
													className="h-7 px-2.5 text-xs font-medium hover:bg-primary/10 hover:text-primary"
													onClick={(e) =>
														handleMarkAsRead(
															notification.id,
															e
														)
													}
												>
													Mark as read
												</Button>
											)}
									</div>

									{expandedNotifications.includes(
										notification.id
									) && (
										<div className="mt-3 space-y-3 pt-2 border-t">
											<div className="text-sm">
												{notification.content}
											</div>

											{notification.link && (
												<Button
													asChild
													variant="outline"
													size="sm"
													className="h-8 text-xs font-medium gap-1.5"
												>
													<Link
														href={notification.link}
													>
														View Details
														<ExternalLink className="ml-1 h-3.5 w-3.5" />
													</Link>
												</Button>
											)}

											{!notification.isRead && (
												<Button
													variant="secondary"
													size="sm"
													className="h-8 text-xs font-medium gap-1.5"
													onClick={(e) =>
														handleMarkAsRead(
															notification.id,
															e
														)
													}
												>
													<Check className="h-3.5 w-3.5" />
													Mark as read
												</Button>
											)}
										</div>
									)}
								</div>
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
						When you receive notifications, they'll appear here.
					</p>
				</div>
			)}

			{showViewAll && (
				<div className="border-t p-3">
					<Button
						variant="ghost"
						className="w-full justify-center"
						asChild
					>
						<Link href="/dashboard/notifications">
							View all notifications
						</Link>
					</Button>
				</div>
			)}
		</div>
	)
}
