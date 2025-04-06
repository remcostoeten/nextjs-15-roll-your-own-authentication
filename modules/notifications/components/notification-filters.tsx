'use client'

import { cn } from '@/lib/utils'

import type React from 'react'

import { Button } from '@/components/ui/button'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
	DropdownMenuCheckboxItem,
} from '@/components/ui/dropdown-menu'
import { Filter, CheckCircle2, AlertTriangle, Info, Clock } from 'lucide-react'

interface NotificationFiltersProps {
	activeFilters: {
		types: string[]
		timeframe: string
		read: string
	}
	setActiveFilters: React.Dispatch<
		React.SetStateAction<{
			types: string[]
			timeframe: string
			read: string
		}>
	>
	typeStats: Record<string, number>
}

export function NotificationFilters({
	activeFilters,
	setActiveFilters,
	typeStats,
}: NotificationFiltersProps) {
	// Toggle type filter
	const toggleTypeFilter = (type: string) => {
		setActiveFilters((prev) => ({
			...prev,
			types: prev.types.includes(type)
				? prev.types.filter((t) => t !== type)
				: [...prev.types, type],
		}))
	}

	// Set timeframe filter
	const setTimeframeFilter = (timeframe: string) => {
		setActiveFilters((prev) => ({
			...prev,
			timeframe,
		}))
	}

	// Set read status filter
	const setReadFilter = (read: string) => {
		setActiveFilters((prev) => ({
			...prev,
			read,
		}))
	}

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					variant="outline"
					size="sm"
					className={cn(
						'h-9 gap-1.5',
						(activeFilters.types.length > 0 ||
							activeFilters.timeframe !== 'all' ||
							activeFilters.read !== 'all') &&
							'bg-primary/10 text-primary border-primary/20'
					)}
				>
					<Filter className="h-4 w-4" />
					<span>Filters</span>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent
				className="w-56"
				align="end"
			>
				<DropdownMenuLabel>Filter Notifications</DropdownMenuLabel>
				<DropdownMenuSeparator />

				<DropdownMenuGroup>
					<DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
						By Type
					</DropdownMenuLabel>

					<DropdownMenuCheckboxItem
						checked={activeFilters.types.includes('success')}
						onCheckedChange={() => toggleTypeFilter('success')}
						className="gap-2"
					>
						<CheckCircle2 className="h-4 w-4 text-emerald-500" />
						Success
						{typeStats.success && (
							<span className="ml-auto text-xs text-muted-foreground">
								{typeStats.success}
							</span>
						)}
					</DropdownMenuCheckboxItem>

					<DropdownMenuCheckboxItem
						checked={activeFilters.types.includes('warning')}
						onCheckedChange={() => toggleTypeFilter('warning')}
						className="gap-2"
					>
						<AlertTriangle className="h-4 w-4 text-amber-500" />
						Warning
						{typeStats.warning && (
							<span className="ml-auto text-xs text-muted-foreground">
								{typeStats.warning}
							</span>
						)}
					</DropdownMenuCheckboxItem>

					<DropdownMenuCheckboxItem
						checked={activeFilters.types.includes('error')}
						onCheckedChange={() => toggleTypeFilter('error')}
						className="gap-2"
					>
						<AlertTriangle className="h-4 w-4 text-rose-500" />
						Error
						{typeStats.error && (
							<span className="ml-auto text-xs text-muted-foreground">
								{typeStats.error}
							</span>
						)}
					</DropdownMenuCheckboxItem>

					<DropdownMenuCheckboxItem
						checked={activeFilters.types.includes('info')}
						onCheckedChange={() => toggleTypeFilter('info')}
						className="gap-2"
					>
						<Info className="h-4 w-4 text-sky-500" />
						Info
						{typeStats.info && (
							<span className="ml-auto text-xs text-muted-foreground">
								{typeStats.info}
							</span>
						)}
					</DropdownMenuCheckboxItem>
				</DropdownMenuGroup>

				<DropdownMenuSeparator />

				<DropdownMenuGroup>
					<DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
						By Time
					</DropdownMenuLabel>

					<DropdownMenuItem
						onClick={() => setTimeframeFilter('all')}
						className={cn(
							'gap-2',
							activeFilters.timeframe === 'all' && 'font-medium'
						)}
					>
						<Clock className="h-4 w-4" />
						All time
						{activeFilters.timeframe === 'all' && (
							<CheckCircle2 className="ml-auto h-4 w-4" />
						)}
					</DropdownMenuItem>

					<DropdownMenuItem
						onClick={() => setTimeframeFilter('today')}
						className={cn(
							'gap-2',
							activeFilters.timeframe === 'today' && 'font-medium'
						)}
					>
						<Clock className="h-4 w-4" />
						Today
						{activeFilters.timeframe === 'today' && (
							<CheckCircle2 className="ml-auto h-4 w-4" />
						)}
					</DropdownMenuItem>

					<DropdownMenuItem
						onClick={() => setTimeframeFilter('week')}
						className={cn(
							'gap-2',
							activeFilters.timeframe === 'week' && 'font-medium'
						)}
					>
						<Clock className="h-4 w-4" />
						This week
						{activeFilters.timeframe === 'week' && (
							<CheckCircle2 className="ml-auto h-4 w-4" />
						)}
					</DropdownMenuItem>

					<DropdownMenuItem
						onClick={() => setTimeframeFilter('month')}
						className={cn(
							'gap-2',
							activeFilters.timeframe === 'month' && 'font-medium'
						)}
					>
						<Clock className="h-4 w-4" />
						This month
						{activeFilters.timeframe === 'month' && (
							<CheckCircle2 className="ml-auto h-4 w-4" />
						)}
					</DropdownMenuItem>
				</DropdownMenuGroup>

				<DropdownMenuSeparator />

				<DropdownMenuGroup>
					<DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
						By Status
					</DropdownMenuLabel>

					<DropdownMenuItem
						onClick={() => setReadFilter('all')}
						className={cn(
							'gap-2',
							activeFilters.read === 'all' && 'font-medium'
						)}
					>
						All notifications
						{activeFilters.read === 'all' && (
							<CheckCircle2 className="ml-auto h-4 w-4" />
						)}
					</DropdownMenuItem>

					<DropdownMenuItem
						onClick={() => setReadFilter('read')}
						className={cn(
							'gap-2',
							activeFilters.read === 'read' && 'font-medium'
						)}
					>
						Read only
						{activeFilters.read === 'read' && (
							<CheckCircle2 className="ml-auto h-4 w-4" />
						)}
					</DropdownMenuItem>

					<DropdownMenuItem
						onClick={() => setReadFilter('unread')}
						className={cn(
							'gap-2',
							activeFilters.read === 'unread' && 'font-medium'
						)}
					>
						Unread only
						{activeFilters.read === 'unread' && (
							<CheckCircle2 className="ml-auto h-4 w-4" />
						)}
					</DropdownMenuItem>
				</DropdownMenuGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}
