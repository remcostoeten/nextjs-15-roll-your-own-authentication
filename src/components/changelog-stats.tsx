'use client'

import { type CommitStats } from '@/features/analytics/components/actions/changelog'
import { cn } from '@/shared/_docs/code-block/cn'
import {
	Activity,
	BarChart3,
	FileCode,
	GitBranch,
	GitCommit,
	Users
} from 'lucide-react'

type ChangelogStatsProps = {
	stats: CommitStats
	className?: string
}

export default function ChangelogStats({
	stats,
	className
}: ChangelogStatsProps) {
	const safeStats = {
		totalCommits: stats.totalCommits ?? 0,
		totalAdditions: stats.totalAdditions ?? 0,
		totalDeletions: stats.totalDeletions ?? 0,
		topContributors: stats.topContributors ?? [],
		mostChangedFiles: stats.mostChangedFiles ?? [],
		languageDistribution: stats.languageDistribution ?? {},
		commitFrequency: {
			hour: stats.commitFrequency?.hour ?? {},
			dayOfWeek: stats.commitFrequency?.dayOfWeek ?? {}
		}
	}

	return (
		<div className={cn('space-y-8', className)}>
			{/* Overview Cards */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
				<div className="p-6 rounded-lg bg-black/40 backdrop-blur-sm border border-white/10">
					<div className="flex items-center gap-2 mb-2">
						<GitCommit className="w-5 h-5 text-neutral-400" />
						<h3 className="text-sm font-medium text-neutral-200">
							Total Commits
						</h3>
					</div>
					<p className="text-2xl font-bold">
						{safeStats.totalCommits}
					</p>
				</div>

				<div className="p-6 rounded-lg bg-black/40 backdrop-blur-sm border border-white/10">
					<div className="flex items-center gap-2 mb-2">
						<Activity className="w-5 h-5 text-neutral-400" />
						<h3 className="text-sm font-medium text-neutral-200">
							Code Changes
						</h3>
					</div>
					<div className="flex items-center gap-4">
						<span className="text-green-400">
							+{safeStats.totalAdditions}
						</span>
						<span className="text-red-400">
							−{safeStats.totalDeletions}
						</span>
					</div>
				</div>

				<div className="p-6 rounded-lg bg-black/40 backdrop-blur-sm border border-white/10">
					<div className="flex items-center gap-2 mb-2">
						<Users className="w-5 h-5 text-neutral-400" />
						<h3 className="text-sm font-medium text-neutral-200">
							Contributors
						</h3>
					</div>
					<p className="text-2xl font-bold">
						{safeStats.topContributors.length}
					</p>
				</div>
			</div>

			{/* Detailed Stats */}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				{/* Top Contributors */}
				<div className="p-6 rounded-lg bg-black/40 backdrop-blur-sm border border-white/10">
					<div className="flex items-center gap-2 mb-4">
						<Users className="w-5 h-5 text-neutral-400" />
						<h3 className="text-sm font-medium text-neutral-200">
							Top Contributors
						</h3>
					</div>
					<div className="space-y-3">
						{safeStats.topContributors.length > 0 ? (
							safeStats.topContributors.map(
								(contributor, index) => (
									<div
										key={contributor.name}
										className="flex items-center justify-between"
									>
										<div className="flex items-center gap-2">
											<span className="text-sm text-neutral-400">
												#{index + 1}
											</span>
											<span className="text-sm">
												{contributor.name}
											</span>
										</div>
										<span className="text-sm text-neutral-400">
											{contributor.commits} commits
										</span>
									</div>
								)
							)
						) : (
							<p className="text-sm text-neutral-400">
								No contributors found
							</p>
						)}
					</div>
				</div>

				{/* Most Changed Files */}
				<div className="p-6 rounded-lg bg-black/40 backdrop-blur-sm border border-white/10">
					<div className="flex items-center gap-2 mb-4">
						<FileCode className="w-5 h-5 text-neutral-400" />
						<h3 className="text-sm font-medium text-neutral-200">
							Most Changed Files
						</h3>
					</div>
					<div className="space-y-3">
						{safeStats.mostChangedFiles.length > 0 ? (
							safeStats.mostChangedFiles
								.slice(0, 5)
								.map((file) => (
									<div
										key={file.filename}
										className="flex items-center justify-between"
									>
										<span className="text-sm font-mono truncate max-w-[70%]">
											{file.filename}
										</span>
										<span className="text-sm text-neutral-400">
											{file.changes} changes
										</span>
									</div>
								))
						) : (
							<p className="text-sm text-neutral-400">
								No file changes found
							</p>
						)}
					</div>
				</div>

				{/* Language Distribution */}
				<div className="p-6 rounded-lg bg-black/40 backdrop-blur-sm border border-white/10">
					<div className="flex items-center gap-2 mb-4">
						<BarChart3 className="w-5 h-5 text-neutral-400" />
						<h3 className="text-sm font-medium text-neutral-200">
							Language Distribution
						</h3>
					</div>
					<div className="space-y-3">
						{Object.entries(safeStats.languageDistribution).length >
						0 ? (
							Object.entries(safeStats.languageDistribution)
								.sort(
									([, a], [, b]) =>
										(b as number) - (a as number)
								)
								.slice(0, 5)
								.map(([lang, changes]) => (
									<div
										key={lang}
										className="flex items-center justify-between"
									>
										<span className="text-sm">.{lang}</span>
										<span className="text-sm text-neutral-400">
											{changes} changes
										</span>
									</div>
								))
						) : (
							<p className="text-sm text-neutral-400">
								No language data found
							</p>
						)}
					</div>
				</div>

				{/* Commit Frequency */}
				<div className="p-6 rounded-lg bg-black/40 backdrop-blur-sm border border-white/10">
					<div className="flex items-center gap-2 mb-4">
						<GitBranch className="w-5 h-5 text-neutral-400" />
						<h3 className="text-sm font-medium text-neutral-200">
							Commit Frequency
						</h3>
					</div>
					<div className="space-y-4">
						<div>
							<h4 className="text-sm text-neutral-400 mb-2">
								By Day of Week
							</h4>
							<div className="grid grid-cols-7 gap-1">
								{Object.entries(
									safeStats.commitFrequency.dayOfWeek
								)
									.sort(([a], [b]) => {
										const days = [
											'Sunday',
											'Monday',
											'Tuesday',
											'Wednesday',
											'Thursday',
											'Friday',
											'Saturday'
										]
										return days.indexOf(a) - days.indexOf(b)
									})
									.map(([day, count]) => {
										const maxCount = Math.max(
											...Object.values(
												safeStats.commitFrequency
													.dayOfWeek
											)
										)
										return (
											<div
												key={day}
												className="text-center"
											>
												<div
													className="w-full aspect-square rounded-sm bg-white/10"
													style={{
														opacity:
															maxCount > 0
																? (count /
																		maxCount) *
																		0.8 +
																	0.2
																: 0.2
													}}
												/>
												<span className="text-xs text-neutral-400 mt-1">
													{day[0]}
												</span>
											</div>
										)
									})}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
