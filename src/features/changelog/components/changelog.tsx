'use client'

import { cn } from '@/lib/utils'
import { LayoutGrid, LayoutList, Search } from 'lucide-react'
import { useState } from 'react'
import { Button, Input, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from 'ui'
import ActivityChart from './activity-chart'

type ChangelogProps = {
	className?: string
}

export default function Changelog({ className }: ChangelogProps) {
	const [activeSection, setActiveSection] = useState('changes')
	const [selectedTimeRange, setSelectedTimeRange] = useState('month')
	const [viewMode, setViewMode] = useState<'list' | 'grid'>('list')
	const [searchQuery, setSearchQuery] = useState('')
	const [sortBy, setSortBy] = useState<'date' | 'impact' | 'files'>('date')
	const [commits, setCommits] = useState<number[]>([
		4, 6, 2, 8, 5, 7, 3, 9, 4, 6, 8, 5,
		7, 3, 5, 8, 4, 6, 2, 7, 5, 3, 8, 4,
		6, 9, 5, 7, 3, 8, 4
	])

	return (
		<div className={cn('max-w-page-size mx-auto px-4 py-8', className)}>
			<svg width="0" height="0" className="absolute">
				<defs>
					<linearGradient
						id="iconGradient"
						x1="0%"
						y1="0%"
						x2="100%"
						y2="100%"
					>
						<stop offset="0%" stopColor="#A855F7" />
						<stop offset="100%" stopColor="#6366F1" />
					</linearGradient>
				</defs>
			</svg>

			<div className="flex items-center justify-between mb-8">
				<h1 className="text-2xl font-bold">Changelog</h1>
				<div className="flex items-center gap-4">
					<Select
						value={selectedTimeRange}
						onValueChange={setSelectedTimeRange}
					>
						<SelectTrigger className="w-32">
							<SelectValue placeholder="Time range" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="week">Past Week</SelectItem>
							<SelectItem value="month">Past Month</SelectItem>
							<SelectItem value="quarter">Past Quarter</SelectItem>
						</SelectContent>
					</Select>
				</div>
			</div>

			<div className="space-y-8">
				<ActivityChart
					data={commits}
					selectedTimeRange={selectedTimeRange}
				/>

				<div className="flex items-center gap-4">
					<Button
						variant="ghost"
						size="sm"
						onClick={() => setViewMode(viewMode === 'list' ? 'grid' : 'list')}
						className="text-neutral-400 hover:text-white"
					>
						{viewMode === 'list' ? (
							<LayoutList className="w-4 h-4 stroke-[url(#iconGradient)]" />
						) : (
							<LayoutGrid className="w-4 h-4 stroke-[url(#iconGradient)]" />
						)}
					</Button>
					
					<div className="relative">
						<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-4 h-4" />
						<Input
							placeholder="Search commits..."
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className="pl-10 w-64 bg-black/20 border-white/10 focus:border-purple-500"
						/>
					</div>

					<Select
						value={sortBy}
						onValueChange={(value: typeof sortBy) => setSortBy(value)}
					>
						<SelectTrigger className="w-32">
							<SelectValue placeholder="Sort by" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="date">Date</SelectItem>
							<SelectItem value="impact">Impact</SelectItem>
							<SelectItem value="files">Files Changed</SelectItem>
						</SelectContent>
					</Select>
				</div>

				{/* Add your commit list/grid view here */}
			</div>
		</div>
	)
}
