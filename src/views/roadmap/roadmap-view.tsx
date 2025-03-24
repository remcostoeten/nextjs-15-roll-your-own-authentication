'use client'

import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { format, parseISO, isAfter, isBefore, isWithinInterval } from 'date-fns'
import { getRoadmapItems, RoadmapItem } from '../../modules/roadmap/api/queries/get-roadmap-items'
import { voteRoadmapItem } from '../../modules/roadmap/api/mutations/vote-roadmap-item'
import { ThumbsUp, Calendar, Users, Tag, ChevronRight, ChevronLeft } from 'lucide-react'
import { ScrollArea } from '@/shared/components/ui/scroll-area'
import { Button } from '@/shared/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/shared/components/ui/tooltip'
import { Badge } from '@/shared/components/ui/badge'
import { Card } from '@/shared/components/ui/card'
import { Heading, Text, Flex } from '@/shared/components/core/typography'
import { cn } from '@/shared/utils/cn'

type ViewMode = 'timeline' | 'quarters' | 'list'
type RoadmapQuarter = {
	name: string
	items: RoadmapItem[]
}

const getStatusColor = (status: RoadmapItem['status']) => {
	switch (status) {
		case 'planned':
			return 'bg-blue-500/10 text-blue-400 border-blue-500/20'
		case 'in-progress':
			return 'bg-amber-500/10 text-amber-400 border-amber-500/20'
		case 'completed':
			return 'bg-green-500/10 text-green-400 border-green-500/20'
		default:
			return 'bg-gray-500/10 text-gray-400 border-gray-500/20'
	}
}

const getStatusText = (status: RoadmapItem['status']) => {
	switch (status) {
		case 'planned':
			return 'Planned'
		case 'in-progress':
			return 'In Progress'
		case 'completed':
			return 'Completed'
		default:
			return status
	}
}

const RoadmapView = () => {
	const [items, setItems] = useState<RoadmapItem[]>([])
	const [quarters, setQuarters] = useState<RoadmapQuarter[]>([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)
	const [votedItems, setVotedItems] = useState<Record<string, boolean>>({})
	const [viewMode, setViewMode] = useState<ViewMode>('timeline')
	const [timelineScale, setTimelineScale] = useState<'months' | 'quarters'>('quarters')
	const [currentDate, setCurrentDate] = useState(new Date())

	useEffect(() => {
		const fetchItems = async () => {
			try {
				const fetchedItems = await getRoadmapItems()
				setItems(fetchedItems)

				// Group items by quarter
				const quarterMap = new Map<string, RoadmapItem[]>()
				fetchedItems.forEach((item) => {
					if (!quarterMap.has(item.quarter)) {
						quarterMap.set(item.quarter, [])
					}
					quarterMap.get(item.quarter)!.push(item)
				})

				const sortedQuarters = Array.from(quarterMap.entries())
					.sort(([aQuarter], [bQuarter]) => {
						const [aYear, aQ] = aQuarter.split(' ')
						const [bYear, bQ] = bQuarter.split(' ')
						if (aYear !== bYear) return Number(aYear) - Number(bYear)
						return aQ.localeCompare(bQ)
					})
					.map(([name, items]) => ({ name, items }))

				setQuarters(sortedQuarters)
				
				// Get voted items from localStorage
				const storedVotes = localStorage.getItem('roadmap_votes')
				if (storedVotes) {
					setVotedItems(JSON.parse(storedVotes))
				}
			} catch (err) {
				setError('Failed to load roadmap items')
				console.error(err)
			} finally {
				setLoading(false)
			}
		}

		fetchItems()
	}, [])

	const handleVote = async (id: string) => {
		try {
			const isVoted = votedItems[id]
			const operation = isVoted ? 'remove' : 'upvote'

			const result = await voteRoadmapItem({
				roadmapId: id,
				operation,
			})

			if (result.success && result.newVoteCount !== undefined) {
				setItems(items.map(item => 
					item.id === id ? { ...item, votes: result.newVoteCount! } : item
				))

				const newVotedItems = { ...votedItems }
				if (operation === 'upvote') {
					newVotedItems[id] = true
				} else {
					delete newVotedItems[id]
				}

				setVotedItems(newVotedItems)
				localStorage.setItem('roadmap_votes', JSON.stringify(newVotedItems))
			}
		} catch (err) {
			console.error('Failed to vote:', err)
		}
	}

	const renderTimelineView = () => {
		const timelineStart = new Date(Math.min(...items.map(item => item.startDate ? new Date(item.startDate).getTime() : Date.now())))
		const timelineEnd = new Date(Math.max(...items.map(item => item.endDate ? new Date(item.endDate).getTime() : Date.now())))

		return (
			<div className="relative">
				{/* Timeline Header */}
				<div className="flex items-center justify-between mb-6">
					<div className="flex gap-2">
						<Button
							variant="outline"
							size="sm"
							onClick={() => setTimelineScale('months')}
							className={cn(timelineScale === 'months' && 'bg-primary text-primary-foreground')}
						>
							Months
						</Button>
						<Button
							variant="outline"
							size="sm"
							onClick={() => setTimelineScale('quarters')}
							className={cn(timelineScale === 'quarters' && 'bg-primary text-primary-foreground')}
						>
							Quarters
						</Button>
					</div>
					<div className="flex gap-2">
						<Button
							variant="ghost"
							size="icon"
							onClick={() => {
								const newDate = new Date(currentDate)
								newDate.setMonth(currentDate.getMonth() - 3)
								setCurrentDate(newDate)
							}}
						>
							<ChevronLeft className="h-4 w-4" />
						</Button>
						<Button
							variant="ghost"
							size="icon"
							onClick={() => {
								const newDate = new Date(currentDate)
								newDate.setMonth(currentDate.getMonth() + 3)
								setCurrentDate(newDate)
							}}
						>
							<ChevronRight className="h-4 w-4" />
						</Button>
					</div>
				</div>

				{/* Timeline Grid */}
				<div className="relative border border-border rounded-lg p-6">
					{/* Time markers */}
					<div className="grid grid-cols-12 gap-4 mb-8">
						{Array.from({ length: 12 }).map((_, i) => {
							const date = new Date(currentDate)
							date.setMonth(currentDate.getMonth() + i)
							return (
								<div key={i} className="text-xs text-muted-foreground text-center">
									{format(date, timelineScale === 'months' ? 'MMM yyyy' : 'Q[Q] yyyy')}
								</div>
							)
						})}
					</div>

					{/* Timeline Items */}
					<div className="space-y-6">
						{items.map((item) => {
							const startDate = item.startDate ? parseISO(item.startDate) : new Date()
							const endDate = item.endDate ? parseISO(item.endDate) : new Date()
							const duration = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 30))
							const startOffset = Math.floor((startDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24 * 30))
							
							return (
								<motion.div
									key={item.id}
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									className="relative"
								>
									<div 
										className={cn(
											"absolute h-8 rounded-full cursor-pointer transition-all duration-300",
											getStatusColor(item.status)
										)}
										style={{
											left: `${(startOffset / 12) * 100}%`,
											width: `${(duration / 12) * 100}%`,
											minWidth: '100px'
										}}
									>
										<Tooltip>
											<TooltipTrigger asChild>
												<div className="flex items-center justify-between h-full px-3">
													<span className="text-xs font-medium truncate">{item.title}</span>
													<div className="flex items-center gap-2">
														{item.assignee && (
															<Tooltip>
																<TooltipTrigger asChild>
																	<Users className="h-3 w-3" />
																</TooltipTrigger>
																<TooltipContent>
																	Assigned to {item.assignee}
																</TooltipContent>
															</Tooltip>
														)}
														<span className="text-xs">{item.progress}%</span>
													</div>
												</div>
											</TooltipTrigger>
											<TooltipContent>
												<div className="p-2">
													<div className="font-medium">{item.title}</div>
													<div className="text-sm text-muted-foreground">{item.description}</div>
													<div className="mt-2 flex gap-2">
														{item.tags?.split(',').map(tag => (
															<Badge key={tag} variant="secondary">{tag}</Badge>
														))}
													</div>
												</div>
											</TooltipContent>
										</Tooltip>
									</div>
								</motion.div>
							)
						})}
					</div>
				</div>
			</div>
		)
	}

	const renderQuartersView = () => {
		return (
			<div className="space-y-8">
				{quarters.map((quarter) => (
					<div key={quarter.name} className="space-y-4">
						<Heading level="h2" className="text-xl font-semibold border-b border-border pb-2">
							{quarter.name}
						</Heading>
						<div className="grid gap-4">
							{quarter.items.map((item) => (
								<motion.div
									key={item.id}
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
								>
									<Card className="p-4">
										<div className="flex items-center justify-between mb-2">
											<div className="flex items-center gap-2">
												<h3 className="font-medium">{item.title}</h3>
												<Badge variant="secondary" className={cn(getStatusColor(item.status))}>
													{item.status}
												</Badge>
											</div>
											<Button
												variant="ghost"
												size="sm"
												onClick={() => handleVote(item.id)}
												className={cn(
													votedItems[item.id] && 'bg-primary/20 text-primary'
												)}
											>
												<ThumbsUp className="h-4 w-4 mr-1" />
												{item.votes}
											</Button>
										</div>
										<Text className="text-sm text-muted-foreground mb-3">
											{item.description}
										</Text>
										<div className="flex items-center gap-4 text-sm text-muted-foreground">
											{item.assignee && (
												<div className="flex items-center gap-1">
													<Users className="h-4 w-4" />
													{item.assignee}
												</div>
											)}
											<div className="flex items-center gap-1">
												<Calendar className="h-4 w-4" />
												{item.startDate && format(parseISO(item.startDate), 'MMM d, yyyy')}
											</div>
											{item.tags && (
												<div className="flex items-center gap-2">
													<Tag className="h-4 w-4" />
													{item.tags.split(',').map(tag => (
														<Badge key={tag} variant="secondary" className="text-xs">
															{tag}
														</Badge>
													))}
												</div>
											)}
										</div>
									</Card>
								</motion.div>
							))}
						</div>
					</div>
				))}
			</div>
		)
	}

	const renderListView = () => {
		return (
			<div className="space-y-4">
				{items.map((item) => (
					<motion.div
						key={item.id}
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
					>
						<Card className="p-4">
							<div className="flex items-start justify-between">
								<div className="space-y-1">
									<div className="flex items-center gap-2">
										<h3 className="font-medium">{item.title}</h3>
										<Badge variant="secondary" className={cn(getStatusColor(item.status))}>
											{item.status}
										</Badge>
									</div>
									<Text className="text-sm text-muted-foreground">
										{item.description}
									</Text>
								</div>
								<Button
									variant="ghost"
									size="sm"
									onClick={() => handleVote(item.id)}
									className={cn(
										votedItems[item.id] && 'bg-primary/20 text-primary'
									)}
								>
									<ThumbsUp className="h-4 w-4 mr-1" />
									{item.votes}
								</Button>
							</div>
							<div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
								{item.assignee && (
									<div className="flex items-center gap-1">
										<Users className="h-4 w-4" />
										{item.assignee}
									</div>
								)}
								<div className="flex items-center gap-1">
									<Calendar className="h-4 w-4" />
									{item.quarter}
								</div>
								{item.tags && (
									<div className="flex items-center gap-2">
										<Tag className="h-4 w-4" />
										{item.tags.split(',').map(tag => (
											<Badge key={tag} variant="secondary" className="text-xs">
												{tag}
											</Badge>
										))}
									</div>
								)}
							</div>
						</Card>
					</motion.div>
				))}
			</div>
		)
	}

	if (loading) {
		return (
			<div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
				<div className="max-w-6xl mx-auto">
					<Heading level="h1" pageTitle>Roadmap</Heading>
					<Text variant="lead" className="mb-12">
						Track our development progress and upcoming features.
					</Text>
					<div className="space-y-16">
						<div className="bg-zinc-900/50 animate-pulse h-40 rounded-lg"></div>
						<div className="bg-zinc-900/50 animate-pulse h-40 rounded-lg"></div>
					</div>
				</div>
			</div>
		)
	}

	if (error) {
		return (
			<div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
				<div className="max-w-6xl mx-auto">
					<Heading level="h1" pageTitle>Roadmap</Heading>
					<Text variant="lead" className="mb-12">
						Track our development progress and upcoming features.
					</Text>
					<div className="bg-red-900/20 border border-red-800 rounded-lg p-6">
						<Text variant="muted" className="text-red-400">{error}</Text>
					</div>
				</div>
			</div>
		)
	}

	return (
		<div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
			<div className="max-w-6xl mx-auto">
				<div className="flex items-center justify-between mb-8">
					<div>
						<Heading level="h1" pageTitle>Roadmap</Heading>
						<Text variant="lead">
							Track our development progress and upcoming features.
						</Text>
					</div>
					<div className="flex gap-2">
						<Button
							variant="outline"
							size="sm"
							onClick={() => setViewMode('timeline')}
							className={cn(viewMode === 'timeline' && 'bg-primary text-primary-foreground')}
						>
							Timeline
						</Button>
						<Button
							variant="outline"
							size="sm"
							onClick={() => setViewMode('quarters')}
							className={cn(viewMode === 'quarters' && 'bg-primary text-primary-foreground')}
						>
							Quarters
						</Button>
						<Button
							variant="outline"
							size="sm"
							onClick={() => setViewMode('list')}
							className={cn(viewMode === 'list' && 'bg-primary text-primary-foreground')}
						>
							List
						</Button>
					</div>
				</div>

				<Card className="p-6">
					<ScrollArea className="h-[calc(100vh-300px)]">
						{viewMode === 'timeline' && renderTimelineView()}
						{viewMode === 'quarters' && renderQuartersView()}
						{viewMode === 'list' && renderListView()}
					</ScrollArea>
				</Card>
			</div>
		</div>
	)
}

export default RoadmapView
