'use client'

import {
	getGithubCommits,
	getVercelDeployments,
	type GitHubCommit,
	type VercelDeployment
} from '@/features/analytics/components/actions/changelog'
import { cn } from '@/shared/_docs/code-block/cn'
import {
	ArrowUpRight,
	Clock,
	FileCode2,
	GitBranch,
	GitCommit,
	Globe,
	Rocket
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { ChangelogSkeleton } from './changelog-skeleton'

type ChangelogProps = {
	className?: string
}

export default function Changelog({ className }: ChangelogProps) {
	const [activeSection, setActiveSection] = useState<
		'deployments' | 'changes'
	>('changes')
	const [commits, setCommits] = useState<GitHubCommit[]>([])
	const [deployments, setDeployments] = useState<VercelDeployment[]>([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		const fetchData = async () => {
			try {
				const [commitsData, deploymentsData] = await Promise.all([
					getGithubCommits(),
					getVercelDeployments()
				])

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

	if (loading) return <ChangelogSkeleton />
	if (error) return <div className="text-red-400">Error: {error}</div>

	return (
		<div className={cn('max-w-4xl mx-auto px-4 py-8', className)}>
			<div className="text-center mb-12">
				<h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-neutral-400">
					Changelog
				</h1>
				<p className="text-neutral-400">
					Track all updates, improvements, and fixes to our
					authentication system.
				</p>
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
						<GitCommit className="w-4 h-4" />
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
						<Rocket className="w-4 h-4" />
						Deployments
					</div>
				</button>
			</div>

			{activeSection === 'deployments' && (
				<div className="space-y-4">
					{deployments.map((deployment) => (
						<div
							key={deployment.uid}
							className="p-6 rounded-xl bg-gradient-to-br from-black/40 to-black/20 backdrop-blur-xl border border-white/10 hover:border-white/20 transition-all duration-300"
						>
							<div className="flex items-center justify-between mb-4">
								<div className="flex items-center gap-3">
									<span
										className={cn(
											'px-3 py-1 rounded-full text-xs font-medium',
											deployment.state === 'ready'
												? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20'
												: 'bg-neutral-500/10 text-neutral-300 border border-neutral-500/20'
										)}
									>
										{deployment.state}
									</span>
									<h3 className="font-medium">
										{deployment.name}
									</h3>
								</div>
								<time className="text-sm text-neutral-400 flex items-center gap-2">
									<Clock className="w-4 h-4" />
									{new Date(
										deployment.created
									).toLocaleString()}
								</time>
							</div>

							{deployment.url && (
								<a
									href={`https://${deployment.url}`}
									target="_blank"
									rel="noopener noreferrer"
									className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors"
								>
									<Globe className="w-4 h-4" />
									<span className="text-sm">
										{deployment.url}
									</span>
									<ArrowUpRight className="w-4 h-4" />
								</a>
							)}
						</div>
					))}
				</div>
			)}

			{activeSection === 'changes' && (
				<div className="space-y-6">
					{commits.map((commit) => (
						<div
							key={commit.sha}
							className="p-6 rounded-xl bg-gradient-to-br from-black/40 to-black/20 backdrop-blur-xl border border-white/10 hover:border-white/20 transition-all duration-300"
						>
							<div className="flex items-center gap-3 mb-4">
								<GitCommit className="w-5 h-5 text-neutral-400" />
								<h3 className="font-medium">
									{commit.commit.message}
								</h3>
							</div>

							<div className="grid grid-cols-2 gap-4">
								<div className="flex items-center gap-2 text-sm text-neutral-400">
									<GitBranch className="w-4 h-4" />
									<span>main</span>
								</div>
								<div className="flex items-center gap-2 text-sm text-neutral-400">
									<FileCode2 className="w-4 h-4" />
									<span>
										{commit.files?.length || 0} files
										changed
									</span>
								</div>
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	)
}
