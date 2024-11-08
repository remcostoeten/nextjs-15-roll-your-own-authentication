'use client'

import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import type {
	GitHubCommit,
	VercelDeployment
} from '@/features/analytics/components/actions/changelog'
import {
	getGithubCommits,
	getVercelDeployments
} from '@/features/analytics/components/actions/changelog'
import { cn } from '@/shared/_docs/code-block/cn'
import { format, parseISO } from 'date-fns'
import {
	AlertCircle,
	ArrowRight,
	CheckCircle2,
	ChevronDown,
	ChevronRight,
	Clock,
	Code2,
	FileCode2,
	GitBranch,
	GitCommit,
	GitMerge,
	Radio,
	Rocket,
	Search
} from 'lucide-react'
import { useEffect, useState } from 'react'

type ChangelogProps = {
	className?: string
}

type CommitType =
	| 'feature'
	| 'fix'
	| 'chore'
	| 'docs'
	| 'refactor'
	| 'style'
	| 'test'

function getCommitType(message: string): CommitType {
	if (message.startsWith('feat:')) return 'feature'
	if (message.startsWith('fix:')) return 'fix'
	if (message.startsWith('chore:')) return 'chore'
	if (message.startsWith('docs:')) return 'docs'
	if (message.startsWith('refactor:')) return 'refactor'
	if (message.startsWith('style:')) return 'style'
	if (message.startsWith('test:')) return 'test'
	return 'feature' // Default to feature
}

const commitTypeConfig: Record<
	CommitType,
	{ icon: React.ReactNode; color: string }
> = {
	feature: {
		icon: <Rocket className="w-4 h-4" />,
		color: 'text-white bg-white/10 border-white/20'
	},
	fix: {
		icon: <CheckCircle2 className="w-4 h-4" />,
		color: 'text-neutral-200 bg-neutral-500/10 border-neutral-500/20'
	},
	chore: {
		icon: <Radio className="w-4 h-4" />,
		color: 'text-neutral-300 bg-neutral-400/10 border-neutral-400/20'
	},
	docs: {
		icon: <GitCommit className="w-4 h-4" />,
		color: 'text-neutral-200 bg-neutral-500/10 border-neutral-500/20'
	},
	refactor: {
		icon: <ArrowRight className="w-4 h-4" />,
		color: 'text-white/80 bg-white/5 border-white/10'
	},
	style: {
		icon: <Rocket className="w-4 h-4" />,
		color: 'text-neutral-200 bg-neutral-500/10 border-neutral-500/20'
	},
	test: {
		icon: <Radio className="w-4 h-4" />,
		color: 'text-neutral-300 bg-neutral-400/10 border-neutral-400/20'
	}
}

type GroupedCommits = {
	[date: string]: GitHubCommit[]
}

function groupCommitsByDate(commits: GitHubCommit[]): GroupedCommits {
	return commits.reduce((groups, commit) => {
		const date = format(
			new Date(commit.commit.author?.date || ''),
			'yyyy-MM-dd'
		)
		if (!groups[date]) {
			groups[date] = []
		}
		groups[date].push(commit)
		return groups
	}, {} as GroupedCommits)
}

type FileFilter = {
	search: string
	status: string[]
}

type DiffViewProps = {
	filename: string
	additions: number
	deletions: number
	patch?: string
	status: string
	branch: string
	commitSha: string
}

function DiffView({
	filename,
	additions,
	deletions,
	patch,
	status,
	branch,
	commitSha
}: DiffViewProps) {
	return (
		<div className="space-y-4">
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-2">
					<FileCode2 className="w-5 h-5 text-gray-400" />
					<span className="font-mono text-sm">{filename}</span>
				</div>
				<div className="flex items-center gap-4">
					{/* Branch badge */}
					<div className="flex items-center gap-1 px-2 py-1 rounded-full bg-white/5 border border-white/10">
						<GitBranch className="w-3 h-3 text-gray-400" />
						<span className="text-xs text-gray-400">{branch}</span>
					</div>
					{/* Commit SHA */}
					<span className="text-xs text-gray-500 font-mono">
						{commitSha.substring(0, 7)}
					</span>
					<span className="text-green-400">+{additions}</span>
					<span className="text-red-400">-{deletions}</span>
					<span
						className={cn(
							'px-2 py-0.5 rounded-full text-xs',
							status === 'added' &&
								'bg-green-500/10 text-green-400 border border-green-500/20',
							status === 'modified' &&
								'bg-blue-500/10 text-blue-400 border border-blue-500/20',
							status === 'removed' &&
								'bg-red-500/10 text-red-400 border border-red-500/20',
							status === 'renamed' &&
								'bg-purple-500/10 text-purple-400 border border-purple-500/20'
						)}
					>
						{status}
					</span>
				</div>
			</div>
			{patch && (
				<div className="bg-black/40 rounded-lg p-4 overflow-x-auto">
					<pre className="text-sm font-mono">
						{patch.split('\n').map((line, i) => {
							const color = line.startsWith('+')
								? 'text-green-400'
								: line.startsWith('-')
									? 'text-red-400'
									: 'text-gray-400'
							return (
								<div
									key={i}
									className={`${color} hover:bg-white/5 px-2 -mx-2 rounded`}
								>
									{line}
								</div>
							)
						})}
					</pre>
				</div>
			)}
		</div>
	)
}

export default function Changelog({ className }: ChangelogProps) {
	const [activeSection, setActiveSection] = useState<
		'deployments' | 'changes'
	>('changes')
	const [commits, setCommits] = useState<GitHubCommit[]>([])
	const [deployments, setDeployments] = useState<VercelDeployment[]>([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)
	const [expandedCommits, setExpandedCommits] = useState<Set<string>>(
		new Set()
	)
	const [stats, setStats] = useState({
		totalCommits: 0,
		frequency: {} as { [key: string]: number },
		languages: {} as { [key: string]: number }
	})
	const [selectedFile, setSelectedFile] = useState<{
		filename: string
		additions: number
		deletions: number
		patch?: string
		status: string
	} | null>(null)
	const [fileFilter, setFileFilter] = useState<FileFilter>({
		search: '',
		status: []
	})

	const toggleCommitExpansion = (commitSha: string) => {
		setExpandedCommits((prev) => {
			const newSet = new Set(prev)
			if (newSet.has(commitSha)) {
				newSet.delete(commitSha)
			} else {
				newSet.add(commitSha)
			}
			return newSet
		})
	}

	useEffect(() => {
		const fetchData = async () => {
			try {
				let commitsData: GitHubCommit[] = []
				let deploymentsData: VercelDeployment[] = []

				try {
					commitsData = await getGithubCommits()
				} catch (error) {
					console.error('Error fetching commits:', error)
				}

				try {
					deploymentsData = await getVercelDeployments()
				} catch (error) {
					console.error('Error fetching deployments:', error)
				}

				setCommits(commitsData)
				setDeployments(deploymentsData)
			} catch (error) {
				console.error('Error fetching changelog data:', error)
				setError(
					error instanceof Error
						? error.message
						: 'Failed to fetch changelog data'
				)
			} finally {
				setLoading(false)
			}
		}

		fetchData()
	}, [])

	useEffect(() => {
		if (commits.length > 0) {
			// Calculate commit frequency by day
			const frequency = commits.reduce(
				(acc, commit) => {
					const date = format(
						new Date(commit.commit.author?.date || ''),
						'yyyy-MM-dd'
					)
					acc[date] = (acc[date] || 0) + 1
					return acc
				},
				{} as { [key: string]: number }
			)

			setStats({
				totalCommits: commits.length,
				frequency,
				languages: {} // We'll populate this when we add language stats
			})
		}
	}, [commits])

	const filterFiles = (files: GitHubCommit['files']) => {
		if (!files) return []
		return files.filter((file) => {
			const matchesSearch = file.filename
				.toLowerCase()
				.includes(fileFilter.search.toLowerCase())
			const matchesStatus =
				fileFilter.status.length === 0 ||
				fileFilter.status.includes(file.status)
			return matchesSearch && matchesStatus
		})
	}

	if (loading) {
		return (
			<div className={cn('max-w-4xl mx-auto px-4 py-8', className)}>
				{/* Header Skeleton */}
				<div className="text-center mb-12">
					<div className="animate-pulse">
						<div className="h-12 w-64 mx-auto mb-4 bg-white/5 rounded-lg" />
						<div className="h-5 w-[500px] mx-auto bg-white/5 rounded-lg" />
					</div>
				</div>

				{/* Stats Cards Skeleton */}
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
					{[1, 2, 3].map((i) => (
						<div
							key={`stat-${i}`}
							className="p-6 rounded-lg bg-white/[0.03] backdrop-blur-sm border border-white/[0.05] relative overflow-hidden"
						>
							<div className="animate-pulse space-y-3">
								<div className="flex items-center gap-2">
									<div className="w-5 h-5 bg-white/5 rounded" />
									<div className="h-4 w-32 bg-white/5 rounded" />
								</div>
								<div className="h-8 w-24 bg-white/5 rounded" />
							</div>
							{/* Shimmer effect */}
							<div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/[0.05] to-transparent" />
						</div>
					))}
				</div>

				{/* Navigation Tabs Skeleton */}
				<div className="flex justify-center mb-8">
					<div className="flex space-x-1 rounded-lg bg-white/[0.03] backdrop-blur-sm border border-white/[0.05] p-1">
						<div className="w-36 h-10 bg-white/5 rounded-md animate-pulse" />
						<div className="w-36 h-10 bg-white/5 rounded-md animate-pulse" />
					</div>
				</div>

				{/* Content Skeleton */}
				<div className="space-y-8">
					{/* Date Separator Skeleton */}
					<div className="flex items-center gap-4 mb-4">
						<div className="h-px flex-1 bg-white/[0.05]" />
						<div className="h-6 w-48 bg-white/5 rounded animate-pulse" />
						<div className="h-px flex-1 bg-white/[0.05]" />
					</div>

					{/* Commit Cards Skeleton */}
					{[1, 2, 3].map((i) => (
						<div
							key={i}
							className="p-6 rounded-lg bg-white/[0.03] backdrop-blur-sm border border-white/[0.05] relative overflow-hidden"
						>
							<div className="animate-pulse space-y-4">
								{/* Commit Header */}
								<div className="flex items-center gap-3">
									<div className="w-10 h-10 bg-white/5 rounded-md" />
									<div className="h-7 w-3/4 bg-white/5 rounded" />
								</div>

								{/* Commit Details Grid */}
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-white/[0.05]">
									<div className="flex items-center gap-2">
										<div className="w-5 h-5 bg-white/5 rounded" />
										<div className="h-5 w-32 bg-white/5 rounded" />
									</div>
									<div className="flex items-center gap-2">
										<div className="w-5 h-5 bg-white/5 rounded" />
										<div className="h-5 w-28 bg-white/5 rounded" />
									</div>
									<div className="flex items-center gap-2">
										<div className="w-5 h-5 bg-white/5 rounded" />
										<div className="h-5 w-40 bg-white/5 rounded" />
									</div>
									<div className="flex items-center justify-end gap-2">
										<div className="h-5 w-48 bg-white/5 rounded" />
									</div>
								</div>
							</div>
							{/* Shimmer effect */}
							<div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/[0.05] to-transparent" />
						</div>
					))}
				</div>
			</div>
		)
	}

	return (
		<div className={cn('max-w-4xl mx-auto px-4 py-8', className)}>
			<div className="text-center mb-12">
				<h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-neutral-400">
					Changelog
				</h1>
				<p className="text-neutral-400 max-w-2xl mx-auto">
					Track all updates, improvements, and fixes to our
					authentication system.
				</p>
			</div>

			{/* Navigation Tabs */}
			<div className="flex justify-center mb-8">
				<nav className="flex space-x-1 rounded-lg bg-black/40 backdrop-blur-sm border border-white/10 p-1">
					<button
						onClick={() => setActiveSection('deployments')}
						className={cn(
							'flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-all duration-200',
							activeSection === 'deployments'
								? 'bg-white/10 text-white shadow-[0_0_10px_rgba(0,0,0,0.1)]'
								: 'text-neutral-400 hover:text-white hover:bg-white/5'
						)}
					>
						<Rocket className="w-4 h-4" />
						Deployments
					</button>
					<button
						onClick={() => setActiveSection('changes')}
						className={cn(
							'flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-all duration-200',
							activeSection === 'changes'
								? 'bg-white/10 text-white shadow-[0_0_10px_rgba(0,0,0,0.1)]'
								: 'text-neutral-400 hover:text-white hover:bg-white/5'
						)}
					>
						<GitCommit className="w-4 h-4" />
						Changes
					</button>
				</nav>
			</div>

			{error && (
				<div className="mb-8 p-4 rounded-lg bg-red-500/10 border border-red-500/20 backdrop-blur-sm flex items-center gap-3">
					<AlertCircle className="w-5 h-5 text-red-400" />
					<p className="text-red-400">{error}</p>
				</div>
			)}

			<div className="space-y-12">
				{/* Deployments Section */}
				{activeSection === 'deployments' && (
					<section className="animate-in fade-in-50">
						<h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
							<Rocket className="w-6 h-6 text-[#0070F3]" />
							Recent Deployments
						</h2>
						<div className="space-y-4">
							{deployments.length > 0 ? (
								deployments.map((deployment) => (
									<div
										key={deployment.uid}
										className="p-4 rounded-lg bg-black/40 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all duration-200"
									>
										<div className="flex items-center justify-between mb-2">
											<div className="flex items-center gap-3">
												<span
													className={cn(
														'px-2 py-1 rounded-full text-xs font-medium',
														deployment.state ===
															'ready'
															? 'bg-neutral-500/10 text-neutral-300 border border-neutral-500/20'
															: 'bg-neutral-600/10 text-neutral-400 border border-neutral-600/20'
													)}
												>
													{deployment.state}
												</span>
												<h3 className="font-medium">
													{deployment.name}
												</h3>
											</div>
											<div className="flex items-center gap-2 text-sm text-neutral-400">
												<Clock className="w-4 h-4" />
												{format(
													new Date(
														deployment.created
													),
													'MMM dd, yyyy HH:mm'
												)}
											</div>
										</div>
										{deployment.url && (
											<a
												href={`https://${deployment.url}`}
												target="_blank"
												rel="noopener noreferrer"
												className="text-sm text-neutral-400 hover:text-white transition-colors flex items-center gap-1"
											>
												<ArrowRight className="w-4 h-4" />
												{deployment.url}
											</a>
										)}
									</div>
								))
							) : (
								<p className="text-neutral-400 text-center py-8">
									No deployments found
								</p>
							)}
						</div>
					</section>
				)}

				{/* Commits Section */}
				{activeSection === 'changes' && (
					<section className="animate-in fade-in-50">
						<h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
							<GitCommit className="w-6 h-6 text-[#FF0080]" />
							Recent Changes
						</h2>
						<div className="space-y-8">
							{Object.entries(groupCommitsByDate(commits)).map(
								([date, dateCommits]) => (
									<div key={date}>
										<div className="flex items-center gap-4 mb-4">
											<div className="h-px flex-1 bg-white/10" />
											<time className="text-sm font-medium text-neutral-400">
												{format(
													parseISO(date),
													'MMMM d, yyyy'
												)}
											</time>
											<div className="h-px flex-1 bg-white/10" />
										</div>
										<div className="space-y-4">
											{dateCommits.map((commit) => {
												const type = getCommitType(
													commit.commit.message
												)
												const { icon, color } =
													commitTypeConfig[type]
												const message =
													commit.commit.message
														.replace(
															/^(feat|fix|chore|docs|refactor|style|test):/,
															''
														)
														.trim()
												const branchMatch =
													message.match(/\[(.*?)\]/)
												const branch = branchMatch
													? branchMatch[1]
													: 'main'
												const isExpanded =
													expandedCommits.has(
														commit.sha
													)
												const totalAdditions =
													commit.stats?.additions || 0
												const totalDeletions =
													commit.stats?.deletions || 0
												const totalFiles =
													commit.files?.length || 0

												return (
													<div
														key={commit.sha}
														className="p-4 rounded-lg bg-black/40 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all duration-200"
													>
														<div className="flex items-center gap-3 mb-3">
															<span
																className={cn(
																	'p-1.5 rounded-md',
																	color
																)}
															>
																{icon}
															</span>
															<h3 className="font-medium">
																{message}
															</h3>
														</div>
														<div className="space-y-3">
															<div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-gray-700/50">
																<div className="flex items-center gap-2 text-sm text-gray-400">
																	<GitBranch className="w-4 h-4" />
																	{commit.merge ? (
																		<div className="flex items-center gap-2">
																			<span className="text-neutral-500">
																				{
																					commit
																						.merge
																						.fromBranch
																				}
																			</span>
																			<GitMerge className="w-4 h-4 text-neutral-400" />
																			<span className="text-neutral-300">
																				{
																					commit
																						.merge
																						.intoBranch
																				}
																			</span>
																		</div>
																	) : (
																		<span>
																			{
																				branch
																			}
																		</span>
																	)}
																	{commit
																		.parents
																		?.length >
																		1 &&
																		!commit.merge && (
																			<span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-neutral-800/50 border border-neutral-700/50 text-xs">
																				<GitMerge className="w-3 h-3 text-neutral-400" />
																				Merge
																				commit
																			</span>
																		)}
																</div>
																<div className="flex items-center gap-2 text-sm text-gray-400">
																	<Code2 className="w-4 h-4" />
																	<span className="space-x-1">
																		<span className="text-green-400">
																			+
																			{
																				totalAdditions
																			}
																		</span>
																		<span className="text-red-400">
																			−
																			{
																				totalDeletions
																			}
																		</span>
																	</span>
																</div>
																<div className="flex items-center gap-2 text-sm text-gray-400">
																	<FileCode2 className="w-4 h-4" />
																	<span>
																		{
																			totalFiles
																		}{' '}
																		files
																		changed
																	</span>
																</div>
																<div className="flex items-center justify-end gap-2 text-sm text-gray-400">
																	<span>
																		By{' '}
																		{commit
																			.commit
																			.author
																			?.name ||
																			'Unknown'}
																	</span>
																	{commit
																		.commit
																		.author
																		?.date && (
																		<time>
																			{format(
																				new Date(
																					commit.commit.author.date
																				),
																				'HH:mm'
																			)}
																		</time>
																	)}
																</div>
															</div>

															{commit.files &&
																commit.files
																	.length >
																	0 && (
																	<div className="pt-2">
																		<div className="flex items-center justify-between mb-4">
																			<button
																				onClick={() =>
																					toggleCommitExpansion(
																						commit.sha
																					)
																				}
																				className="flex items-center gap-2 text-sm text-gray-400 hover:text-gray-300 transition-colors"
																			>
																				{isExpanded ? (
																					<ChevronDown className="w-4 h-4" />
																				) : (
																					<ChevronRight className="w-4 h-4" />
																				)}
																				Show
																				changed
																				files
																			</button>
																			{isExpanded && (
																				<div className="flex items-center gap-4">
																					<div className="relative">
																						<Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
																						<Input
																							placeholder="Filter files..."
																							value={
																								fileFilter.search
																							}
																							onChange={(
																								e
																							) =>
																								setFileFilter(
																									(
																										prev
																									) => ({
																										...prev,
																										search: e
																											.target
																											.value
																									})
																								)
																							}
																							className="pl-9 h-8 text-sm bg-black/20"
																						/>
																					</div>
																					<div className="flex items-center gap-2">
																						{[
																							'added',
																							'modified',
																							'removed',
																							'renamed'
																						].map(
																							(
																								status
																							) => (
																								<button
																									key={
																										status
																									}
																									onClick={() =>
																										setFileFilter(
																											(
																												prev
																											) => ({
																												...prev,
																												status: prev.status.includes(
																													status
																												)
																													? prev.status.filter(
																															(
																																s
																															) =>
																																s !==
																																status
																														)
																													: [
																															...prev.status,
																															status
																														]
																											})
																										)
																									}
																									className={cn(
																										'px-2 py-1 text-xs rounded-full border transition-colors',
																										fileFilter.status.includes(
																											status
																										)
																											? 'bg-white/10 text-white border-white/20'
																											: 'bg-transparent text-gray-400 border-gray-700/50'
																									)}
																								>
																									{
																										status
																									}
																								</button>
																							)
																						)}
																					</div>
																				</div>
																			)}
																		</div>

																		{isExpanded && (
																			<div className="mt-3 space-y-2">
																				{filterFiles(
																					commit.files
																				).map(
																					(
																						file,
																						index
																					) => (
																						<div
																							key={
																								index
																							}
																							className="pl-6 py-2 text-sm border-l border-gray-700/50"
																						>
																							<button
																								onClick={() =>
																									setSelectedFile(
																										file
																									)
																								}
																								className="group w-full flex items-center justify-between hover:bg-white/5 rounded-lg p-2 transition-all duration-200 relative overflow-hidden"
																							>
																								{/* Hover effect background */}
																								<div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/[0.02] to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500" />

																								{/* File info */}
																								<div className="flex items-center gap-2 relative">
																									<FileCode2 className="w-4 h-4 text-gray-400 group-hover:text-[#7928CA] transition-colors" />
																									<span className="text-gray-300 font-mono group-hover:text-white transition-colors">
																										{
																											file.filename
																										}
																									</span>
																									{/* Click hint */}
																									<span className="opacity-0 group-hover:opacity-100 transition-opacity text-xs text-neutral-400 ml-2">
																										Click
																										to
																										view
																										diff
																									</span>
																								</div>

																								<div className="flex items-center gap-4 relative">
																									{/* Branch info */}
																									<div className="flex items-center gap-1 px-2 py-1 rounded-full bg-white/5 border border-white/10">
																										<GitBranch className="w-3 h-3 text-gray-400" />
																										<span className="text-xs text-gray-400">
																											{
																												branch
																											}
																										</span>
																										{commit
																											.parents
																											?.length >
																											1 && (
																											<GitMerge
																												className="w-3 h-3 text-purple-400 ml-1"
																												title="Merge commit"
																											/>
																										)}
																									</div>

																									{/* File stats */}
																									<div className="flex items-center gap-4 text-xs">
																										<span className="text-green-400">
																											+
																											{
																												file.additions
																											}
																										</span>
																										<span className="text-red-400">
																											−
																											{
																												file.deletions
																											}
																										</span>
																										<span
																											className={cn(
																												'px-2 py-0.5 rounded-full',
																												file.status ===
																													'added' &&
																													'bg-neutral-500/10 text-neutral-300 border border-neutral-500/20',
																												file.status ===
																													'modified' &&
																													'bg-neutral-600/10 text-neutral-400 border border-neutral-600/20',
																												file.status ===
																													'removed' &&
																													'bg-neutral-700/10 text-neutral-500 border border-neutral-700/20',
																												file.status ===
																													'renamed' &&
																													'bg-neutral-800/10 text-neutral-600 border border-neutral-800/20'
																											)}
																										>
																											{
																												file.status
																											}
																										</span>
																									</div>
																								</div>
																							</button>
																						</div>
																					)
																				)}
																			</div>
																		)}
																	</div>
																)}
														</div>
													</div>
												)
											})}
										</div>
									</div>
								)
							)}
						</div>
					</section>
				)}
			</div>

			<Dialog
				open={!!selectedFile}
				onOpenChange={() => setSelectedFile(null)}
			>
				<DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
					{selectedFile && <DiffView {...selectedFile} />}
				</DialogContent>
			</Dialog>
		</div>
	)
}
