'use client'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
	HoverCard,
	HoverCardContent,
	HoverCardTrigger
} from '@/components/ui/hover-card'
import { Skeleton } from '@/components/ui/skeleton'
import { format } from 'date-fns'
import { motion } from 'framer-motion'
import {
	Calendar,
	Clock,
	Code,
	ExternalLink,
	GitBranch,
	GitCommit,
	GitFork,
	Info,
	Loader2,
	Plus,
	Star,
	User
} from 'lucide-react'
import Link from 'next/link'
import { Suspense, useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'
import {
	getRepositoryCommits,
	getRepositoryInfo
} from '../api/queries/get-github-data'
import { IGitHubCommit, IGitHubRepository } from '../types'
import CommitSquare from './commit-squares'

function formatCommitMessage(message: string) {
	const lines = message.split('\n').filter((line) => line.trim() !== '')
	return {
		title: lines[0] || '',
		description: lines.slice(1) || []
	}
}

function formatDate(dateString: string) {
	try {
		const date = new Date(dateString)
		return format(date, 'MMM d, yyyy')
	} catch (e) {
		return dateString
	}
}

function getRelativeTime(dateString: string) {
	try {
		const date = new Date(dateString)
		const now = new Date()
		const diffMs = now.getTime() - date.getTime()
		const diffSecs = Math.floor(diffMs / 1000)
		const diffMins = Math.floor(diffSecs / 60)
		const diffHours = Math.floor(diffMins / 60)
		const diffDays = Math.floor(diffHours / 24)

		if (diffDays > 30) {
			return formatDate(dateString)
		} else if (diffDays > 0) {
			return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`
		} else if (diffHours > 0) {
			return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
		} else if (diffMins > 0) {
			return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`
		} else {
			return 'just now'
		}
	} catch (e) {
		return 'recently'
	}
}

function CommitSquaresSkeleton() {
	return (
		<div className='ml-2 flex gap-1'>
			{[0, 1, 2, 3, 4].map((i) => (
				<Skeleton
					key={`skeleton-${i}`}
					className='h-3 w-3 rounded-sm border border-gray-700 bg-gray-800'
				/>
			))}
		</div>
	)
}

function RepositoryInfoSkeleton() {
	return (
		<div className='space-y-6'>
			<div className='flex gap-2 text-sm text-[#8C877D]'>
				<Skeleton className='h-4 w-32 bg-gray-800' />
			</div>

			<div className='space-y-2'>
				<Skeleton className='h-8 w-96 bg-gray-800' />
				<Skeleton className='h-8 w-80 bg-gray-800' />
			</div>

			<div className='flex items-center gap-2'>
				<Skeleton className='h-4 w-24 bg-gray-800' />
				<Skeleton className='h-4 w-40 bg-gray-800' />
			</div>

			<div className='flex items-center gap-2'>
				<Skeleton className='h-4 w-32 bg-gray-800' />
			</div>

			<div className='flex gap-4'>
				<Skeleton className='h-10 w-32 rounded-md bg-gray-800' />
				<Skeleton className='h-10 w-40 rounded-md bg-gray-800' />
			</div>
		</div>
	)
}

function CommitSquares({ commits }: { commits: IGitHubCommit[] }) {
	return (
		<div className='ml-2 flex gap-1'>
			{commits?.slice(0, 5).map((commit, index) => (
				<CommitSquare key={`commit-${commit.sha}`} commit={commit} index={index} />
			))}
		</div>
	)
}

export default function GitHubRepository() {
	const [repository, setRepository] = useState<IGitHubRepository | null>(null)
	const [commits, setCommits] = useState<IGitHubCommit[] | null>(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<Error | null>(null)
	const [showTooltip, setShowTooltip] = useState(false)
	const commitLinkRef = useRef<HTMLButtonElement>(null)
	const tooltipRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		async function fetchData() {
			try {
				setLoading(true)

				const [repoData, commitsData] = await Promise.all([
					getRepositoryInfo(),
					getRepositoryCommits(5)
				])

				setRepository(repoData)
				setCommits(commitsData)
				setLoading(false)
			} catch (err) {
				setError(
					err instanceof Error
						? err
						: new Error('Unknown error occurred')
				)
				setLoading(false)
				toast.error(
					'Failed to load repository data. Please try again later.'
				)
			}
		}

		fetchData()
	}, [])

	const latestCommit = commits && commits.length > 0 ? commits[0] : null

	const commitMessage = latestCommit
		? formatCommitMessage(latestCommit.commit.message)
		: { title: '', description: [] }

	const containerVariants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: {
				staggerChildren: 0.15,
				delayChildren: 0.1
			}
		}
	}

	const itemVariants = {
		hidden: { opacity: 0, y: 20 },
		visible: {
			opacity: 1,
			y: 0,
			transition: {
				type: 'spring',
				damping: 12,
				stiffness: 100
			}
		}
	}

	const wordVariants = {
		hidden: { opacity: 0, y: 20 },
		visible: (i: number) => ({
			opacity: 1,
			y: 0,
			transition: {
				type: 'spring',
				damping: 12,
				stiffness: 100,
				delay: i * 0.05
			}
		})
	}

	const iconVariants = {
		hidden: { opacity: 0, scale: 0.5 },
		visible: {
			opacity: 1,
			scale: 1,
			transition: {
				type: 'spring',
				damping: 10,
				stiffness: 100
			}
		}
	}

	const titleWords =
		'Build secure authentication without the vendor lock-in.'.split(' ')

	if (loading) {
		return (
			<div className='relative min-h-screen px-6 pt-32'>
				<RepositoryInfoSkeleton />
			</div>
		)
	}

	if (error) {
		return (
			<div className='container mx-auto max-w-4xl px-4 py-6'>
				<Alert variant='destructive'>
					<AlertTitle>Error loading repository data</AlertTitle>
					<AlertDescription>{error.message}</AlertDescription>
				</Alert>
			</div>
		)
	}

	return (
		<motion.div
			className='relative min-h-screen px-6 pt-32'
			initial='hidden'
			animate='visible'
			variants={containerVariants}
		>
			{/* Plus icons */}
			<motion.div
				className='absolute left-4 top-4'
				variants={iconVariants}
			>
				<Plus className='h-4 w-4 text-[#1E1E1E]' />
			</motion.div>

			<motion.div
				className='absolute right-4 top-4'
				variants={iconVariants}
			>
				<Plus className='h-4 w-4 text-[#1E1E1E]' />
			</motion.div>

			<motion.div
				className='flex gap-2 text-sm text-[#8C877D]'
				variants={itemVariants}
			>
				<span>Roll Your Own Auth</span>
			</motion.div>

			<motion.h1
				className='mt-4 max-w-2xl text-4xl font-normal tracking-tight'
				variants={itemVariants}
			>
				{titleWords.map((word, i) => (
					<motion.span
						key={word}
						custom={i}
						variants={wordVariants}
						className='inline-block bg-gradient-to-b from-[#F2F0ED] to-[#ADADAD] bg-clip-text text-transparent'
						style={{ marginRight: '0.3em' }}
					>
						{word}
					</motion.span>
				))}
			</motion.h1>

			<motion.div
				className='mt-6 flex items-center gap-2 text-sm'
				variants={itemVariants}
			>
				<div className='flex items-center'>
					<span className='text-[#8C877D]'>git:(</span>
					<HoverCard openDelay={0} closeDelay={0}>
						<HoverCardTrigger asChild>
							<span className='group relative cursor-pointer italic text-[#4e9815] transition-colors hover:text-[#6bc427]'>
								{repository?.default_branch || 'main'}
								<span className='absolute -bottom-1 left-0 h-0.5 w-0 bg-[#4e9815] transition-all duration-300 group-hover:w-full'></span>
							</span>
						</HoverCardTrigger>
						<HoverCardContent
							className='w-80 max-w-md border border-[#333333] bg-[#0D0C0C]/95 p-4 shadow-lg backdrop-blur-sm'
							side='top'
							align='start'
						>
							<div className='space-y-4'>
								<div className='flex items-center justify-between'>
									<h3 className='text-lg font-medium text-[#F2F0ED]'>
										{repository?.name}
									</h3>
									<a
										href={repository?.html_url}
										target='_blank'
										rel='noopener noreferrer'
										className='text-[#4e9815] hover:text-[#6bc427]'
									>
										<ExternalLink className='h-4 w-4' />
									</a>
								</div>

								<div className='space-y-3'>
									{repository?.description && (
										<div className='flex items-start gap-2 text-sm'>
											<Info className='mt-0.5 h-4 w-4 text-[#4e9815]' />
											<span className='text-[#ADADAD]'>
												{repository.description}
											</span>
										</div>
									)}

									<div className='flex items-center gap-2 text-sm'>
										<GitBranch className='h-4 w-4 text-[#4e9815]' />
										<span className='text-[#8C877D]'>
											Default branch:
										</span>
										<span className='text-[#F2F0ED]'>
											{repository?.default_branch}
										</span>
									</div>

									<div className='flex items-center gap-2 text-sm'>
										<Code className='h-4 w-4 text-[#4e9815]' />
										<span className='text-[#8C877D]'>
											Main language:
										</span>
										<span className='text-[#F2F0ED]'>
											{repository?.language ||
												'Not specified'}
										</span>
									</div>

									<div className='flex items-center gap-2 text-sm'>
										<Clock className='h-4 w-4 text-[#4e9815]' />
										<span className='text-[#8C877D]'>
											Last updated:
										</span>
										<span className='text-[#F2F0ED]'>
											{repository?.updated_at
												? getRelativeTime(
														repository.updated_at
													)
												: 'Unknown'}
										</span>
									</div>

									<div className='mt-2 flex flex-wrap gap-2'>
										{repository?.topics?.slice(0, 4)?.map((topic) => (
											<Badge
												key={`topic-${topic}`}
												className='bg-[#1E1E1E] text-[#F2F0ED] hover:bg-[#2E2E2E]'
											>
												{topic}
											</Badge>
										))}
									</div>

									<div className='mt-2 flex gap-4 border-t border-[#1E1E1E] pt-2'>
										<div className='flex items-center gap-1 text-sm'>
											<Star className='h-4 w-4 text-[#8C877D]' />
											<span className='text-[#F2F0ED]'>
												{repository?.stargazers_count ||
													0}
											</span>
										</div>
										<div className='flex items-center gap-1 text-sm'>
											<GitFork className='h-4 w-4 text-[#8C877D]' />
											<span className='text-[#F2F0ED]'>
												{repository?.forks_count || 0}
											</span>
										</div>
										<div className='flex items-center gap-1 text-sm'>
											<User className='h-4 w-4 text-[#8C877D]' />
											<span className='text-[#F2F0ED]'>
												{repository?.watchers_count ||
													0}{' '}
												watchers
											</span>
										</div>
									</div>
								</div>
							</div>
						</HoverCardContent>
					</HoverCard>
					<span className='text-[#8C877D]'>)</span>
					<span className='mx-2 text-[#8C877D]'>×</span>
					<div className='flex items-center'>
						<span className='text-[#F2F0ED]'>
							{repository?.name ||
								'nextjs-15-roll-your-own-authentication'}
						</span>

						{/* Small commit squares next to repo name with Suspense for loading state */}
						<Suspense fallback={<CommitSquaresSkeleton />}>
							{commits ? (
								<CommitSquares commits={commits} />
							) : (
								<CommitSquaresSkeleton />
							)}
						</Suspense>
					</div>
				</div>
			</motion.div>

			{/* Latest commit info tagline */}
			<motion.div
				className='relative min-h-[1.5rem] mt-2 flex items-center text-xs text-[#8C877D]'
				variants={itemVariants}
			>
				{loading ? (
					<div className='flex items-center'>
						<span className='mr-2 font-mono'>$</span>
						<Loader2 className='mr-2 h-3 w-3 animate-spin' />
						<span>Fetching latest commit...</span>
					</div>
				) : error ? (
					<div className='flex items-center'>
						<span className='mr-2 font-mono'>$</span>
						<span className='text-red-400'>
							Error fetching commit
						</span>
					</div>
				) : (
					latestCommit && (
						<>
							<span className='mr-2 font-mono'>$</span>
							<span className='mr-1'>Latest commit:</span>
							<button
								type="button"
								ref={commitLinkRef}
								className='group relative inline-flex items-center'
								onClick={() => setShowTooltip(true)}
								onMouseLeave={() => setShowTooltip(false)}
							>
								<span className='group relative cursor-pointer italic text-[#4e9815] transition-colors hover:text-[#6bc427]'>{commitMessage.title}</span>
								<span className='absolute -bottom-1 left-0 h-0.5 w-0 bg-[#4e9815] transition-all duration-300 group-hover:w-full'></span>
							</button>
							<span className='ml-2 text-[#8C877D]'>—</span>
							<span className='ml-2 italic text-[#8C877D]'>
								{latestCommit.commit.author.date
									? getRelativeTime(
											latestCommit.commit.author.date
										)
									: ''}
							</span>

							{/* Git info tooltip */}
							{showTooltip && (
								<div
									ref={tooltipRef}
									className='absolute bottom-8 left-24 z-[100] w-80 rounded-md border border-[#1E1E1E] bg-[#0D0C0C]/95 p-4 shadow-xl backdrop-blur-sm'
									style={{
										boxShadow:
											'0 4px 20px rgba(0, 0, 0, 0.5)'
									}}
								>
									{/* Arrow pointing DOWN */}
									<div className='absolute -bottom-2 left-24 h-4 w-4 rotate-45 border-b border-r border-[#1E1E1E] bg-[#0D0C0C]'></div>

									{/* Commit header */}
									<div className='mb-3 border-b border-[#1E1E1E] pb-2'>
										<h4 className='text-sm font-medium text-[#F2F0ED]'>
											Commit Details
										</h4>
									</div>

									{/* Commit info */}
									<div className='space-y-2 text-xs'>
										<div className='flex items-start gap-2'>
											<GitCommit className='mt-0.5 h-3.5 w-3.5 text-[#4e9815]' />
											<div>
												<div className='text-[#8C877D]'>
													Hash
												</div>
												<div className='font-mono text-[#F2F0ED]'>
													{latestCommit.sha.substring(
														0,
														10
													)}
												</div>
											</div>
										</div>

										<div className='flex items-start gap-2'>
											<User className='mt-0.5 h-3.5 w-3.5 text-[#4e9815]' />
											<div>
												<div className='text-[#8C877D]'>
													Author
												</div>
												<div className='text-[#F2F0ED]'>
													{latestCommit.author
														?.login ||
														latestCommit.commit
															.author.name}
													{latestCommit.commit.author
														.email &&
														` <${latestCommit.commit.author.email}>`}
												</div>
											</div>
										</div>

										<div className='flex items-start gap-2'>
											<Calendar className='mt-0.5 h-3.5 w-3.5 text-[#4e9815]' />
											<div>
												<div className='text-[#8C877D]'>
													Date
												</div>
												<div className='text-[#F2F0ED]'>
													{formatDate(
														latestCommit.commit
															.author.date
													)}
												</div>
											</div>
										</div>

										<div className='pt-1'>
											<div className='mb-1 text-[#8C877D]'>
												Message
											</div>
											<div className='rounded-md bg-[#1E1E1E]/50 p-2 font-mono text-[#F2F0ED]'>
												{commitMessage.title}
												{commitMessage.description
													.length > 0 && (
													<div className='mt-2'>
														{commitMessage.description.map(
															(line) => (
																<div
																	key={line}
																	className='text-[#8C877D]'
																>
																	{line}
																</div>
															)
														)}
													</div>
												)}
											</div>
										</div>
									</div>

									<Link
										href={latestCommit.html_url}
										target='_blank'
										rel='noopener noreferrer'
										className='mt-3 flex items-center justify-center gap-1 rounded-md border border-[#1E1E1E] px-3 py-1.5 text-xs text-[#4e9815] transition-colors hover:bg-[#1E1E1E]/50'
									>
										View on GitHub{' '}
										<ExternalLink className='h-3 w-3' />
									</Link>
								</div>
							)}
						</>
					)
				)}
			</motion.div>

			<motion.div
				className='relative z-20 mt-4 flex gap-4'
				variants={itemVariants}
			>
				<Button
					variant='outline'
					className='border-none bg-white text-black hover:bg-white/90'
				>
					_read the docs
				</Button>
				<Button
					variant='outline'
					className='border-[#1E1E1E] bg-transparent text-gray-300 hover:bg-[#1E1E1E]'
				>
					+ create account
				</Button>
			</motion.div>
		</motion.div>
	)
}
