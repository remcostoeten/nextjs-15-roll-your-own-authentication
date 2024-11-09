'use client'

import Tooltip from '@/components/tooltip'
import {
    getCommitStats,
    getGithubCommits,
    getVercelDeployments,
    type GitHubCommit,
    type VercelDeployment
} from '@/features/analytics/components/actions/changelog'
import { cn } from '@/shared/_docs/code-block/cn'
import CodeBlock from '@/shared/_docs/code-block/code-block'
import { addDays, format, subDays } from 'date-fns'
import { AnimatePresence, motion } from 'framer-motion'
import {
    ArrowUpRight,
    ChevronDown,
    Clock,
    Copy,
    FileCode2,
    GitBranch,
    GitCommit,
    Github,
    Globe,
    LayoutGrid,
    LayoutList,
    Rocket,
    Search
} from 'lucide-react'
import { Fragment, useEffect, useMemo, useState } from 'react'
import { Line, LineChart, Tooltip as RechartsTooltip, ResponsiveContainer, XAxis, YAxis } from 'recharts'
import {
    Badge, Button, Collapsible, CollapsibleContent, CollapsibleTrigger, Dialog, DialogContent, DialogTrigger, Input, ScrollArea, Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from 'ui'
import { ChangelogSkeleton } from './changelog-skeleton'

type ChangelogProps = {
	className?: string
}

type TimelineItem = {
	type: 'commit' | 'deployment'
	date: Date
	data: GitHubCommit | VercelDeployment
	isNewDay?: boolean
}

// Add these type guards after the TimelineItem type definition
const isCommit = (item: TimelineItem): item is TimelineItem & { type: 'commit'; data: GitHubCommit } => {
	return item.type === 'commit'
}

const isDeployment = (item: TimelineItem): item is TimelineItem & { type: 'deployment'; data: VercelDeployment } => {
	return item.type === 'deployment'
}

// Add the pillStyles constant
const pillStyles = {
	ready: 'bg-emerald-500/20 text-emerald-300 border-2 border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.15)]',
	building: 'bg-yellow-500/20 text-yellow-300 border-2 border-yellow-500/30 shadow-[0_0_15px_rgba(245,158,11,0.15)]',
	error: 'bg-red-500/20 text-red-300 border-2 border-red-500/30 shadow-[0_0_15px_rgba(239,68,68,0.15)]',
	canceled: 'bg-neutral-500/20 text-neutral-300 border-2 border-neutral-500/30'
} as const

type CommitActivityData = {
	date: string
	commits: number
	additions?: number
	deletions?: number
}

function ActivityChart({ data, selectedTimeRange }: { data: CommitActivityData[], selectedTimeRange: string }) {
	return (
		<div className="w-full h-[300px] mt-8 mb-12 p-6 rounded-xl bg-gradient-to-br from-black/40 to-black/20 backdrop-blur-xl border border-white/10">
			<h3 className="text-lg font-medium mb-6">Commit Activity</h3>
			<ResponsiveContainer width="100%" height={200}>
				<LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
					<XAxis 
						dataKey="date" 
						stroke="#525252"
						tick={{ fill: '#525252' }}
					/>
					<YAxis 
						stroke="#525252"
						tick={{ fill: '#525252' }}
					/>
					<RechartsTooltip
						contentStyle={{
							backgroundColor: 'rgba(0, 0, 0, 0.8)',
							border: '1px solid rgba(255, 255, 255, 0.1)',
							borderRadius: '8px',
							color: '#fff'
						}}
					/>
					<Line 
						type="monotone" 
						dataKey="commits" 
						stroke="url(#gradientLine)" 
						strokeWidth={2}
						dot={false}
					/>
				</LineChart>
			</ResponsiveContainer>
			<svg width="0" height="0">
				<defs>
					<linearGradient id="gradientLine" x1="0%" y1="0%" x2="100%" y2="0%">
						<stop offset="0%" stopColor="#F472B6" />
						<stop offset="100%" stopColor="#A78BFA" />
					</linearGradient>
				</defs>
			</svg>
		</div>
	)
}

export default function Changelog({ className }: ChangelogProps) {
	const [activeSection, setActiveSection] = useState<'deployments' | 'changes'>('changes')
	const [commits, setCommits] = useState<GitHubCommit[]>([])
	const [deployments, setDeployments] = useState<VercelDeployment[]>([])
	const [stats, setStats] = useState<any>(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)
	const [searchQuery, setSearchQuery] = useState('')
	const [authorFilter, setAuthorFilter] = useState('all')
	const [dateFilter, setDateFilter] = useState('all')
	const [selectedTimeRange, setSelectedTimeRange] = useState('week')
	const [isLastMergeOpen, setIsLastMergeOpen] = useState(true)
	const [extensionFilter, setExtensionFilter] = useState<string[]>([])
	const [showExtensionFilter, setShowExtensionFilter] = useState(false)
	const [viewMode, setViewMode] = useState<'list' | 'grid'>('list')
	const [sortBy, setSortBy] = useState<'date' | 'impact' | 'files'>('date')
	const [showStats, setShowStats] = useState(true)
	const [commitFilters, setCommitFilters] = useState<Record<string, string[]>>({})
	const [showImpactfulOnly, setShowImpactfulOnly] = useState(false)
	const [showMergesOnly, setShowMergesOnly] = useState(false)
	const [expandedCommits, setExpandedCommits] = useState<Set<string>>(new Set())
	const [expandedMerges, setExpandedMerges] = useState<Set<string>>(new Set())

	useEffect(() => {
		const fetchData = async () => {
			try {
				const [commitsData, deploymentsData, statsData] = await Promise.all([
					getGithubCommits(),
					getVercelDeployments(),
					getCommitStats()
				])

				setCommits(commitsData)
				setDeployments(deploymentsData)
				setStats(statsData)
			} catch (error) {
				console.error('Error fetching changelog data:', error)
				setError(error instanceof Error ? error.message : 'Failed to fetch changelog data')
			} finally {
				setLoading(false)
			}
		}

		fetchData()
	}, [])

	const getLanguageColor = (filename: string) => {
		const ext = filename.split('.').pop()?.toLowerCase()
		const colors: Record<string, string> = {
			ts: 'text-blue-400',
			tsx: 'text-blue-500',
			js: 'text-yellow-400',
			jsx: 'text-yellow-500',
			css: 'text-purple-400',
			html: 'text-orange-400',
			json: 'text-green-400'
		}
		return colors[ext || ''] || 'text-gray-400'
	}

	const getTimeRangeData = (commits: GitHubCommit[], selectedTimeRange: string): CommitActivityData[] => {
		const ranges = {
			'week': 7,
			'month': 30,
			'quarter': 90
		}
		
		const days = ranges[selectedTimeRange as keyof typeof ranges]
		const endDate = new Date()
		const startDate = subDays(endDate, days)
		
		return Array.from({ length: days }, (_, i) => {
			const date = addDays(startDate, i)
			const commitsOnDay = commits.filter(c => 
				new Date(c.commit.author?.date || '').toDateString() === date.toDateString()
			).length
			
			return {
				date: format(date, 'MMM dd'),
				commits: commitsOnDay
			}
		})
	}

	const getUniqueFileExtensions = () => {
		const extensions = new Set<string>()
		commits.forEach(commit => {
			commit.files?.forEach(file => {
				const ext = file.filename.split('.').pop()?.toLowerCase()
				if (ext) extensions.add(ext)
			})
		})
		return Array.from(extensions)
	}

	const calculateCommitImpact = (commit: GitHubCommit) => {
		const totalChanges = commit.files?.reduce((acc, file) => 
			acc + file.additions + file.deletions, 0) || 0
		const filesChanged = commit.files?.length || 0
		return totalChanges * 0.7 + filesChanged * 0.3 // Weighted score
	}

	const filteredCommits = commits ? commits.filter(commit => {
		const matchesSearch = commit.commit.message.toLowerCase()
			.includes(searchQuery.toLowerCase())
		
		const matchesAuthor = authorFilter === 'all' || 
			commit.commit.author?.name === authorFilter
		
		const matchesExtensions = extensionFilter.length === 0 || 
			commit.files?.some(file => {
				const ext = file.filename.split('.').pop()?.toLowerCase()
				return ext && extensionFilter.includes(ext)
			})
		
		const matchesImpact = !showImpactfulOnly || 
			calculateCommitImpact(commit) > 50
		
		const matchesMerges = !showMergesOnly || 
			commit.parents.length > 1 || commit.commit.message.toLowerCase().includes('merge')

		const commitDate = new Date(commit.commit.author?.date || '')
		const matchesDate = (() => {
			if (dateFilter === 'all') return true
			const now = new Date()
			
			switch(dateFilter) {
				case 'today':
					return commitDate.toDateString() === now.toDateString()
				case 'week':
					const weekAgo = new Date(now.setDate(now.getDate() - 7))
					return commitDate >= weekAgo
				case 'month':
					const monthAgo = new Date(now.setMonth(now.getMonth() - 1))
					return commitDate >= monthAgo
				default:
					return true
			}
		})()
		
		return matchesSearch && matchesAuthor && matchesDate && 
			   matchesExtensions && matchesImpact && matchesMerges
	}) : []

	const createTimeline = (commits: GitHubCommit[], deployments: VercelDeployment[]): TimelineItem[] => {
		const timeline: TimelineItem[] = [
			...commits.map(commit => ({
				type: 'commit' as const,
				date: new Date(commit.commit.author?.date || ''),
				data: commit
			})),
			...deployments.map(deployment => ({
				type: 'deployment' as const,
				date: new Date(deployment.created),
				data: deployment
			}))
		].sort((a, b) => b.date.getTime() - a.date.getTime())

		let currentDay = ''
		return timeline.map(item => {
			const itemDay = item.date.toDateString()
			const isNewDay = itemDay !== currentDay
			currentDay = itemDay
			return { ...item, isNewDay }
		})
	}

	const sortedTimeline = useMemo(() => {
		if (!commits || !deployments) return []
		
		const timeline = createTimeline(filteredCommits, deployments)
		
		if (activeSection === 'deployments') {
			return timeline.filter(item => item.type === 'deployment')
		}
		
		if (activeSection === 'changes') {
			return timeline.filter(item => item.type === 'commit')
		}
		
		return timeline
	}, [commits, deployments, filteredCommits, activeSection])

	const CommitStats = ({ commit }: { commit: GitHubCommit }) => {
		const impact = calculateCommitImpact(commit)
		return (
			<Tooltip
				content={
					<div className="space-y-2">
						<p>Impact Score measures the significance of a commit based on:</p>
						<ul className="list-disc list-inside space-y-1">
							<li>Total lines changed (70% weight)</li>
							<li>Number of files modified (30% weight)</li>
						</ul>
						<p className="text-sm mt-2">
							Higher scores indicate more substantial changes to the codebase.
						</p>
					</div>
				}
				position="top"
				variant="dark"
				showPointer
				className="cursor-help"
			>
				<div className="flex items-center gap-2 text-sm">
					<div className="h-2 w-24 bg-black/20 rounded-full overflow-hidden">
						<motion.div 
							className="h-full bg-gradient-to-r from-pink-400 to-purple-400"
							style={{ width: `${Math.min(100, (impact / 100) * 100)}%` }}
							initial={{ width: 0 }}
							animate={{ width: `${Math.min(100, (impact / 100) * 100)}%` }}
							transition={{ duration: 0.5, ease: "easeOut" }}
						/>
					</div>
					<span className="text-neutral-400">Impact Score</span>
				</div>
			</Tooltip>
		)
	}

	const CommitFilterBar = ({ commit, sha }: { commit: GitHubCommit; sha: string }) => {
		const extensions = new Set(commit.files?.map(file => 
			file.filename.split('.').pop()?.toLowerCase()
		).filter(Boolean))

		return (
			<div className="mt-2 flex flex-wrap gap-2">
				{Array.from(extensions).map((ext) => (
					<button
						key={ext}
						onClick={() => {
							setCommitFilters(prev => ({
								...prev,
								[sha]: prev[sha]?.includes(ext as string)
									? prev[sha].filter(e => e !== ext)
									: [...(prev[sha] || []), ext as string]
							}))
						}}
						className={cn(
							'px-2 py-0.5 text-xs rounded-full transition-all',
							commitFilters[sha]?.includes(ext as string)
								? 'bg-gradient-to-r from-pink-400 to-purple-400 text-white'
								: 'bg-black/40 text-neutral-400 hover:text-white'
						)}
					>
						.{ext}
					</button>
				))}
			</div>
		)
	}

	if (loading) return <ChangelogSkeleton />
	if (error) return <div className="text-red-400">Error: {error}</div>

	const authors = Array.from(new Set(commits.map(c => c.commit.author?.name).filter(Boolean)))

	return (
		<div className={cn('max-w-page-size mx-auto px-4 py-8', className)}>
			<svg width="0" height="0" className="absolute">
				<defs>
					<linearGradient id="iconGradient" x1="0%" y1="0%" x2="100%" y2="0%">
						<stop offset="0%" stopColor="#F472B6" />
						<stop offset="100%" stopColor="#A78BFA" />
					</linearGradient>
				</defs>
			</svg>
			<div className="mb-12">
				<h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-neutral-400">
					Development Timeline
				</h1>
				<div className="space-y-4 text-neutral-400 max-w-2xl">
					<p>
						Track the evolution of our authentication system through a comprehensive timeline of changes, deployments, and improvements. This changelog provides detailed insights into code changes, feature additions, and system deployments.
					</p>
					<p>
						Each commit is analyzed for its impact score - a metric that combines the scope of changes (additions and deletions) with the breadth of files affected, helping identify significant updates.
					</p>
				</div>
			</div>

			<div className="flex items-center gap-4 mb-8">
				<button
					onClick={() => setActiveSection('changes')}
					className={cn(
						'px-4 py-2 rounded-lg transition-all duration-200',
						activeSection === 'changes'
							? 'bg-white/10 text-white'
							: 'text-neutral-400 hover:text-white hover:bg-white/5'
					)}
				>
					<div className="flex items-center gap-2">
						<GitCommit className="w-4 h-4 stroke-[url(#iconGradient)]" />
						Changes
					</div>
				</button>
				<button
					onClick={() => setActiveSection('deployments')}
					 className={cn(
						'px-4 py-2 rounded-lg transition-all duration-200',
						activeSection === 'deployments'
							? 'bg-white/10 text-white'
							: 'text-neutral-400 hover:text-white hover:bg-white/5'
					)}
				>
					<div className="flex items-center gap-2">
						<Rocket className="w-4 h-4 stroke-[url(#iconGradient)]" />
						Deployments			
					</div>
				</button>
			</div>

			{activeSection === 'deployments' && (
				<div className="space-y-4">
					{deployments.length === 0 ? (
						<div className="text-center p-6 bg-black/20 rounded-xl border border-white/10">
							<p className="text-neutral-400">No deployments found</p>
						</div>
					) : (
						deployments.map((deployment) => (
							<div
								key={deployment.uid}
								className="p-6 rounded-xl bg-gradient-to-br from-black/40 to-black/20 backdrop-blur-xl border border-white/10 hover:border-white/20 transition-all duration-300"
								>
								<div className="flex items-center justify-between mb-4">
									<div className="flex items-center gap-3">
										<span
											className={cn(
												'px-3 py-1 rounded-full text-xs font-medium',
												{
													'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20': deployment.state === 'ready',
													'bg-yellow-500/10 text-yellow-300 border border-yellow-500/20': deployment.state === 'building',
													'bg-red-500/10 text-red-300 border border-red-500/20': deployment.state === 'error',
													'bg-neutral-500/10 text-neutral-300 border border-neutral-500/20': deployment.state === 'canceled'
												}
											)}
										>
											{deployment.state.charAt(0).toUpperCase() + deployment.state.slice(1)}
										</span>
										<h3 className="font-medium">
											{deployment.name || 'Unnamed deployment'}
										</h3>
										{deployment.meta?.branch && (
											<span className="text-sm text-neutral-400 flex items-center gap-2">
												<GitBranch className="w-4 h-4 stroke-[url(#iconGradient)]" />
												{deployment.meta.branch}
											</span>
										)}
									</div>
									<time className="text-sm text-neutral-400 flex items-center gap-2">
										<Clock className="w-4 h-4 stroke-[url(#iconGradient)]" />
										{new Date(deployment.created).toLocaleString()}
									</time>
								</div>

								{deployment.meta?.commit && (
									<div className="mb-4 p-3 bg-black/20 rounded-lg text-sm text-neutral-400">
										<div className="flex items-center gap-2">
											<GitCommit className="w-4 h-4 stroke-[url(#iconGradient)]" />
											{deployment.meta.commit.message}
										</div>
										{deployment.meta.commit.sha && (
											<div className="mt-2 text-xs font-mono">
												{deployment.meta.commit.sha.slice(0, 7)}
											</div>
										)}
									</div>
								)}

								{deployment.url && (
									<div className="space-y-2">
										<a
											href={`https://${deployment.url}`}
											target="_blank"
											rel="noopener noreferrer"
											className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors"
										>
											<Globe className="w-4 h-4 stroke-[url(#iconGradient)]" />
											<span className="text-sm">{deployment.url}</span>
											<ArrowUpRight className="w-4 h-4" />
										</a>
										<div className="flex gap-2">
											<a
												href={`https://${deployment.url}`}
												target="_blank"
												rel="noopener noreferrer"
												className="inline-flex items-center gap-2 px-3 py-1 text-sm rounded-lg bg-gradient-to-r from-pink-400 to-purple-400 text-white hover:from-pink-500 hover:to-purple-500 transition-colors"
											>
												<Rocket className="w-4 h-4" />
												Preview Deployment
											</a>
											{deployment.state === 'ready' && (
												<Button
													variant="outline"
													size="sm"
													className="border-white/10 hover:border-white/20"
													onClick={() => {
														navigator.clipboard.writeText(`https://${deployment.url}`)
													}}
												>
													<Copy className="w-4 h-4 mr-2" />
													Copy URL
												</Button>
											)}
										</div>
									</div>
								)}
							</div>
						))
					)}
				</div>
			)}

			{activeSection === 'changes' && (
				<>
					<ActivityChart 
						data={getTimeRangeData(commits, selectedTimeRange)} 
						selectedTimeRange={selectedTimeRange}
					/>
					
					<div className="flex items-center gap-4 mb-6">
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
						<div className="flex items-center gap-2">
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
								onValueChange={(value) => setSortBy(value as typeof sortBy)}
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
						<div className="flex items-center gap-2">
							<Button
								variant="ghost"
								size="sm"
								onClick={() => setShowImpactfulOnly(!showImpactfulOnly)}
								className={cn(
									"text-neutral-400 hover:text-white group relative",
									showImpactfulOnly && "bg-gradient-to-r from-pink-400/20 to-purple-400/20"
								)}
								>
								<Tooltip
									content="Show only commits with significant code changes"
									position="top"
									variant="dark"
								>
									{showImpactfulOnly ? 'Show All' : 'Show Impactful'}
								</Tooltip>
							</Button>
							<Button
								variant="ghost"
								size="sm"
								onClick={() => setShowMergesOnly(!showMergesOnly)}
								className={cn(
									"text-neutral-400 hover:text-white",
									showMergesOnly && "bg-gradient-to-r from-pink-400/20 to-purple-400/20"
								)}
							>
								{showMergesOnly ? 'Show All' : 'Show Merges'}
							</Button>
							<Dialog>
								<DialogTrigger asChild>
									<Button
										variant="ghost"
										size="sm"
										className="text-neutral-400 hover:text-white"
									>
										File Filters
									</Button>
								</DialogTrigger>
								<DialogContent className="sm:max-w-[425px]">
									<div className="flex flex-wrap gap-2 p-4">
										{getUniqueFileExtensions().map((ext) => (
											<button
												key={ext}
												onClick={() => {
													setExtensionFilter(prev => 
														prev.includes(ext) 
															? prev.filter(e => e !== ext)
															: [...prev, ext]
													)
												}}
												className={cn(
													'px-3 py-1 text-xs rounded-full transition-all',
													extensionFilter.includes(ext)
														? 'bg-gradient-to-r from-pink-400 to-purple-400 text-white'
														: 'bg-black/40 text-neutral-400 hover:text-white'
												)}
											>
												.{ext}
											</button>
										))}
									</div>
								</DialogContent>
							</Dialog>
						</div>
					</div>

					<div className={cn(
						'space-y-6',
						viewMode === 'grid' && 'grid grid-cols-2 gap-6 space-y-0'
					)}>
						{sortedTimeline.map((item, index) => (
							<Fragment key={isCommit(item) ? item.data.sha : item.data.uid}>
								{item.isNewDay && (
									<div className="col-span-full py-4">
										<div className="flex items-center gap-4">
											<div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
											<time className="text-sm text-neutral-400">
												{format(item.date, 'MMMM d, yyyy')}
											</time>
											<div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
										</div>
									</div>
								)}
								<div className="p-6 rounded-xl bg-gradient-to-br from-black/40 to-black/20 backdrop-blur-xl border border-white/10 hover:border-white/20 transition-all duration-300">
									{isCommit(item) ? (
										<>
											<div className="flex items-center justify-between mb-4">
												<div className="flex items-center gap-3">
													<GitCommit className="w-5 h-5 stroke-[url(#iconGradient)]" />
													<h3 className="font-medium">{item.data.commit.message}</h3>
												</div>
												<div className="flex items-center gap-4">
													<a
														href={`https://github.com/remcostoeten/nextjs-15-roll-your-own-authentication/commit/${item.data.sha}`}
														target="_blank"
														rel="noopener noreferrer"
														className="text-neutral-400 hover:text-white"
													>
														<Github className="w-5 h-5 stroke-[url(#iconGradient)]" />
													</a>
												</div>
											</div>

											<div className="grid grid-cols-3 gap-4 mb-4">
												<div className="flex items-center gap-2 text-sm text-neutral-400">
													<Clock className="w-4 h-4 stroke-[url(#iconGradient)]" />
													<time>{new Date(item.data.commit.author?.date || '').toLocaleString()}</time>
												</div>
												<div className="flex items-center gap-2 text-sm text-neutral-400">
													<span>
														Author:{' '}
														{item.data.commit.author?.name === 'Remco Stoeten' ? (
															<a
																href="https://github.com/remcostoeten"
																target="_blank"
																rel="noopener noreferrer"
																className="text-purple-400 hover:text-pink-400 hover:underline"
															>
																Remco Stoeten
															</a>
														) : (
															item.data.commit.author?.name
															)}
													</span>
												</div>
												{item.data.merge && (
													<div className="flex items-center gap-2 text-sm text-neutral-400">
														<GitBranch className="w-4 h-4 stroke-[url(#iconGradient)]" />
														<span>{item.data.merge.fromBranch} → {item.data.merge.intoBranch}</span>
													</div>
												)}
											</div>

											<div className="flex items-center justify-between mb-4">
												<CommitFilterBar commit={item.data} sha={item.data.sha} />
											</div>

											<Collapsible
												open={expandedMerges.has(item.data.sha)}
												onOpenChange={(isOpen) => {
													setExpandedMerges(prev => {
														const newSet = new Set(prev)
														if (isOpen) {
															newSet.add(item.data.sha)
														} else {
															newSet.delete(item.data.sha)
														}
														return newSet
													})
												}}
											>
												<CollapsibleTrigger className="flex items-center gap-2 text-sm text-neutral-400 hover:text-white">
													<motion.div
														animate={{ rotate: expandedMerges.has(item.data.sha) ? 180 : 0 }}
														transition={{ duration: 0.2 }}
													>
														<ChevronDown className="w-4 h-4" />
													</motion.div>
													<span>{item.data.files?.length || 0} files changed</span>
												</CollapsibleTrigger>
												<AnimatePresence>
													{expandedMerges.has(item.data.sha) && (
														<CollapsibleContent
															asChild
															forceMount
														>
															<motion.div
																initial={{ height: 0, opacity: 0 }}
																animate={{ height: 'auto', opacity: 1 }}
																exit={{ height: 0, opacity: 0 }}
																transition={{ duration: 0.2 }}
																className="mt-4 space-y-2"
															>
																{item.data.files?.filter(file => {
																	const ext = file.filename.split('.').pop()?.toLowerCase()
																	return !commitFilters[item.data.sha]?.length || 
																			(ext && commitFilters[item.data.sha].includes(ext))
																}).map((file) => (
																	<Dialog key={file.filename}>
																		<DialogTrigger asChild>
																			<div className="flex items-center justify-between p-2 rounded bg-black/20 cursor-pointer hover:bg-black/30 transition-colors">
																				<div className="flex items-center gap-2">
																						<FileCode2 
																							className={cn(
																								"w-4 h-4 stroke-[url(#iconGradient)]",
																								getLanguageColor(file.filename)
																							)} 
																						/>
																						<span className="text-sm">{file.filename}</span>
																				</div>
																				<div className="flex items-center gap-4">
																						<Badge 
																							variant="secondary" 
																							className="bg-black/40 backdrop-blur-md border border-green-500/20 text-green-400 px-3"
																						>
																							+{file.additions}
																						</Badge>
																						<Badge 
																							variant="secondary" 
																							className="bg-black/40 backdrop-blur-md border border-red-500/20 text-red-400 px-3"
																						>
																							-{file.deletions}
																						</Badge>
																				</div>
																			</div>
																		</DialogTrigger>
																		<DialogContent className="max-w-4xl max-h-[80vh]">
																			<ScrollArea className="h-full">
																				<div className="p-6">
																					<div className="flex items-center justify-between mb-6">
																						<h3 className="text-lg font-semibold">{file.filename}</h3>
																						<div className="flex items-center gap-2">
																							<Badge 
																								variant="secondary" 
																								className="bg-black/40 backdrop-blur-md border border-green-500/20 text-green-400 px-3"
																							>
																								+{file.additions}
																							</Badge>
																							<Badge 
																								variant="secondary" 
																								className="bg-black/40 backdrop-blur-md border border-red-500/20 text-red-400 px-3"
																							>
																								-{file.deletions}
																							</Badge>
																						</div>
																					</div>
																					<CodeBlock
																						code={file.patch || ''}
																						language={(() => {
																							const ext = file.filename.split('.').pop()?.toLowerCase() || ''
																							switch(ext) {
																								case 'ts':
																								case 'tsx':
																									return 'typescript'
																								case 'js':
																								case 'jsx':
																									return 'javascript'
																								case 'css':
																									return 'css'
																								case 'html':
																									return 'html'
																								case 'json':
																									return 'json'
																								default:
																									return 'plaintext'
																							}
																						})()}
																						fileName={file.filename}
																						showLineNumbers={true}
																						enableLineHighlight={true}
																						showMetaInfo={true}
																						maxHeight="calc(80vh - 200px)"
																					/>
																				</div>
																			</ScrollArea>
																		</DialogContent>
																	</Dialog>
																))}
															</motion.div>
														</CollapsibleContent>
													)}
												</AnimatePresence>
											</Collapsible>
											{showStats && <CommitStats commit={item.data} />}
										</>
									) : (
										<>
											<div className="flex items-center justify-between mb-4">
												<div className="flex items-center gap-3">
													<span className={cn(
														'px-3 py-1 rounded-full text-xs font-medium',
														pillStyles[item.data.state]
													)}>
														{item.data.state.charAt(0).toUpperCase() + item.data.state.slice(1)}
													</span>
													<Rocket className="w-4 h-4 stroke-[url(#iconGradient)]" />
													<h3 className="font-medium">
														{item.data.name || 'Unnamed deployment'}
													</h3>
												</div>
												<time className="text-sm text-neutral-400">
													{format(item.date, 'HH:mm')}
												</time>
											</div>
											{/* ... rest of deployment content ... */}
										</>
									)}
								</div>
							</Fragment>
						))}
					</div>
				</>
			)}
		</div>
	)
}
