'use client'

import { useState, useEffect } from 'react'
import { NotificationList } from './notification-list'
import { getUserNotifications } from '../api/queries'
import { markAllNotificationsAsRead } from '../api/mutations'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
	BellRing,
	Settings,
	Search,
	RefreshCw,
	Clock,
	List,
	CheckCircle2,
	Filter,
	X,
} from 'lucide-react'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { toast } from '@/hooks/use-toast'
import { NotificationFilters } from './notification-filters'
import { NotificationSettings } from './notifications-settings'
import { NotificationStats } from './notifications-stats'
import { NotificationTimeline } from './notifications-timeline'

type TProps = {
	initialNotifications: any[]
	user: any
}

export function NotificationsContainer({ initialNotifications, user }: TProps) {
	const [notifications, setNotifications] = useState(initialNotifications)
	const [filteredNotifications, setFilteredNotifications] =
		useState(initialNotifications)
	const [isLoading, setIsLoading] = useState(false)
	const [searchQuery, setSearchQuery] = useState('')
	const [viewMode, setViewMode] = useState<'list' | 'timeline'>('list')
	const [showSettings, setShowSettings] = useState(false)
	const [activeFilters, setActiveFilters] = useState<{
		types: string[]
		timeframe: string
		read: string
	}>({
		types: [],
		timeframe: 'all',
		read: 'all',
	})

	const unreadCount = notifications.filter((n) => !n.isRead).length
	const typeStats = notifications.reduce(
		(acc: Record<string, number>, notification) => {
			const type = notification.type || 'info'
			acc[type] = (acc[type] || 0) + 1
			return acc
		},
		{}
	)

	useEffect(() => {
		let result = [...notifications]

		if (activeFilters.types.length > 0) {
			result = result.filter((n) =>
				activeFilters.types.includes(n.type || 'info')
			)
		}

		if (activeFilters.read === 'read') {
			result = result.filter((n) => n.isRead)
		} else if (activeFilters.read === 'unread') {
			result = result.filter((n) => !n.isRead)
		}

		// Apply timeframe filter
		const now = new Date()
		if (activeFilters.timeframe === 'today') {
			const startOfDay = new Date(now.setHours(0, 0, 0, 0))
			result = result.filter((n) => new Date(n.createdAt) >= startOfDay)
		} else if (activeFilters.timeframe === 'week') {
			const startOfWeek = new Date(now)
			startOfWeek.setDate(now.getDate() - now.getDay())
			startOfWeek.setHours(0, 0, 0, 0)
			result = result.filter((n) => new Date(n.createdAt) >= startOfWeek)
		} else if (activeFilters.timeframe === 'month') {
			const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
			result = result.filter((n) => new Date(n.createdAt) >= startOfMonth)
		}

		// Apply search
		if (searchQuery.trim()) {
			const query = searchQuery.toLowerCase()
			result = result.filter(
				(n) =>
					n.title.toLowerCase().includes(query) ||
					n.content.toLowerCase().includes(query)
			)
		}

		setFilteredNotifications(result)
	}, [notifications, activeFilters, searchQuery])

	// Refresh notifications
	const refreshNotifications = async () => {
		setIsLoading(true)
		try {
			const { notifications: newNotifications } =
				await getUserNotifications(50, 0)
			setNotifications(newNotifications)
			toast({
				title: 'Notifications refreshed',
				description: 'Your notifications have been updated',
			})
		} catch (error) {
			console.error('Error refreshing notifications:', error)
			toast({
				title: 'Refresh failed',
				description:
					'Could not refresh notifications. Please try again.',
				variant: 'destructive',
			})
		} finally {
			setIsLoading(false)
		}
	}

	// Mark all as read
	const handleMarkAllAsRead = async () => {
		setIsLoading(true)
		try {
			await markAllNotificationsAsRead()
			setNotifications((prev) =>
				prev.map((n) => ({ ...n, isRead: true }))
			)
			toast({
				title: 'All notifications marked as read',
				description: `${unreadCount} notification${
					unreadCount !== 1 ? 's' : ''
				} marked as read`,
			})
		} catch (error) {
			console.error('Error marking all as read:', error)
			toast({
				title: 'Action failed',
				description:
					'Could not mark notifications as read. Please try again.',
				variant: 'destructive',
			})
		} finally {
			setIsLoading(false)
		}
	}

	// Clear all filters
	const clearFilters = () => {
		setActiveFilters({
			types: [],
			timeframe: 'all',
			read: 'all',
		})
		setSearchQuery('')
	}

	// Check if any filters are active
	const hasActiveFilters =
		activeFilters.types.length > 0 ||
		activeFilters.timeframe !== 'all' ||
		activeFilters.read !== 'all' ||
		searchQuery.trim() !== ''

	return (
		<div className="mx-auto max-w-4xl">
			<div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
				<div className="flex items-center gap-3">
					<div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
						<BellRing className="h-6 w-6 text-primary" />
					</div>
					<div>
						<h1 className="text-2xl font-bold tracking-tight">
							Notifications
						</h1>
						<p className="text-sm text-muted-foreground">
							Stay updated with your latest activities and alerts
						</p>
					</div>
				</div>

				<div className="flex items-center gap-2">
					<Button
						variant="outline"
						size="sm"
						onClick={refreshNotifications}
						disabled={isLoading}
						className="h-9 gap-1.5"
					>
						<RefreshCw
							className={`h-4 w-4 ${
								isLoading ? 'animate-spin' : ''
							}`}
						/>
						<span className="hidden sm:inline">Refresh</span>
					</Button>

					<Button
						variant="outline"
						size="sm"
						onClick={() => setShowSettings(!showSettings)}
						className="h-9 gap-1.5"
					>
						<Settings className="h-4 w-4" />
						<span className="hidden sm:inline">Settings</span>
					</Button>

					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button
								variant="outline"
								size="sm"
								className="h-9 gap-1.5"
							>
								<Filter className="h-4 w-4" />
								<span className="hidden sm:inline">View</span>
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuItem
								onClick={() => setViewMode('list')}
								className="gap-2"
							>
								<List className="h-4 w-4" />
								List View
							</DropdownMenuItem>
							<DropdownMenuItem
								onClick={() => setViewMode('timeline')}
								className="gap-2"
							>
								<Clock className="h-4 w-4" />
								Timeline View
							</DropdownMenuItem>
							<DropdownMenuSeparator />
							<DropdownMenuItem
								onClick={handleMarkAllAsRead}
								disabled={unreadCount === 0}
								className="gap-2"
							>
								<CheckCircle2 className="h-4 w-4" />
								Mark All as Read
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</div>

			{showSettings && (
				<div className="mb-6 rounded-xl border bg-card p-4 shadow-sm">
					<div className="mb-3 flex items-center justify-between">
						<h2 className="text-lg font-semibold">
							Notification Preferences
						</h2>
						<Button
							variant="ghost"
							size="sm"
							onClick={() => setShowSettings(false)}
						>
							<X className="h-4 w-4" />
						</Button>
					</div>
					<NotificationSettings user={user} />
				</div>
			)}

			<div className="mb-6 grid gap-4 md:grid-cols-3">
				<NotificationStats
					total={notifications.length}
					unread={unreadCount}
					typeStats={typeStats}
				/>
			</div>

			<div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
				<div className="relative w-full sm:max-w-xs">
					<Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
					<Input
						type="search"
						placeholder="Search notifications..."
						className="w-full pl-9 pr-4"
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
					/>
				</div>

				<NotificationFilters
					activeFilters={activeFilters}
					setActiveFilters={setActiveFilters}
					typeStats={typeStats}
				/>
			</div>

			{hasActiveFilters && (
				<div className="mb-4 flex items-center justify-between rounded-lg border bg-muted/30 px-3 py-2">
					<div className="flex flex-wrap items-center gap-2">
						<span className="text-sm font-medium">Filters:</span>

						{activeFilters.types.length > 0 && (
							<Badge
								variant="outline"
								className="gap-1 font-normal"
							>
								Types: {activeFilters.types.join(', ')}
							</Badge>
						)}

						{activeFilters.timeframe !== 'all' && (
							<Badge
								variant="outline"
								className="gap-1 font-normal"
							>
								Time: {activeFilters.timeframe}
							</Badge>
						)}

						{activeFilters.read !== 'all' && (
							<Badge
								variant="outline"
								className="gap-1 font-normal"
							>
								Status: {activeFilters.read}
							</Badge>
						)}

						{searchQuery.trim() !== '' && (
							<Badge
								variant="outline"
								className="gap-1 font-normal"
							>
								Search: "{searchQuery}"
							</Badge>
						)}

						<span className="text-sm text-muted-foreground">
							{filteredNotifications.length} result
							{filteredNotifications.length !== 1 ? 's' : ''}
						</span>
					</div>

					<Button
						variant="ghost"
						size="sm"
						onClick={clearFilters}
						className="h-7 px-2 text-xs"
					>
						Clear All
					</Button>
				</div>
			)}

			<div className="overflow-hidden rounded-xl border bg-card shadow-sm">
				{viewMode === 'list' ? (
					<NotificationList
						notifications={filteredNotifications}
						isLoading={isLoading}
						onRefresh={refreshNotifications}
						onNotificationUpdate={(updatedNotification) => {
							setNotifications((prev) =>
								prev.map((n) =>
									n.id === updatedNotification.id
										? updatedNotification
										: n
								)
							)
						}}
					/>
				) : (
					<NotificationTimeline
						notifications={filteredNotifications}
						isLoading={isLoading}
						onNotificationUpdate={(updatedNotification) => {
							setNotifications((prev) =>
								prev.map((n) =>
									n.id === updatedNotification.id
										? updatedNotification
										: n
								)
							)
						}}
					/>
				)}
			</div>
		</div>
	)
}
