'use client'

import type React from 'react'
import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
	Calendar,
	GitBranch,
	GitCommit,
	GitFork,
	Star,
	Users,
} from 'lucide-react'
import { useGithubData } from '@/modules/github/hooks/use-github-data'

interface ProjectMetricsProps {
	children: React.ReactNode
}

export function ProjectMetrics({ children }: ProjectMetricsProps) {
	const [isHovered, setIsHovered] = useState(false)
	const triggerRef = useRef<HTMLDivElement>(null)

	const { repoData, isLoading, error } = useGithubData({
		owner: 'remcostoeten',
		repo: 'nextjs-15-roll-your-own-authentication',
	})

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
		})
	}

	return (
		<div
			ref={triggerRef}
			className="relative inline-flex cursor-pointer"
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
		>
			{children}

			<AnimatePresence>
				{isHovered && (
					<motion.div
						initial={{ opacity: 0, y: -10 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -10 }}
						className="absolute bottom-full left-0 z-[200] mt-2 w-80 rounded border border-[#1E1E1E] bg-[#0D0C0C] p-4 text-xs shadow-lg mb-2"
					>
						{/* Arrow */}
						<div className="absolute -bottom-1 left-4 h-2 w-2 rotate-45 border border-[#1E1E1E] border-l-0 border-t-0 bg-[#0D0C0C]" />

						{isLoading ? (
							<div className="flex items-center justify-center py-4">
								<div className="h-5 w-5 animate-spin rounded-full border-2 border-[#4e9815] border-t-transparent" />
							</div>
						) : error ? (
							<div className="text-red-500 py-2">{error}</div>
						) : repoData ? (
							<>
								<h3 className="mb-2 text-sm font-medium text-[#F2F0ED]">
									{repoData.name}
								</h3>
								<p className="mb-3 text-[#8C877D]">
									{repoData.description}
								</p>

								<div className="grid grid-cols-2 gap-3">
									<div className="flex items-center gap-2 text-[#8C877D]">
										<Calendar className="h-3.5 w-3.5" />
										<span>
											Created:{' '}
											{formatDate(repoData.created_at)}
										</span>
									</div>

									<div className="flex items-center gap-2 text-[#8C877D]">
										<GitCommit className="h-3.5 w-3.5" />
										<span>
											Updated:{' '}
											{formatDate(repoData.updated_at)}
										</span>
									</div>

									<div className="flex items-center gap-2 text-[#8C877D]">
										<Star className="h-3.5 w-3.5" />
										<span>Stars: {repoData.stars}</span>
									</div>

									<div className="flex items-center gap-2 text-[#8C877D]">
										<GitFork className="h-3.5 w-3.5" />
										<span>Forks: {repoData.forks}</span>
									</div>

									<div className="flex items-center gap-2 text-[#8C877D]">
										<GitBranch className="h-3.5 w-3.5" />
										<span>
											Branches: {repoData.branches}
										</span>
									</div>

									<div className="flex items-center gap-2 text-[#8C877D]">
										<Users className="h-3.5 w-3.5" />
										<span>
											Contributors:{' '}
											{repoData.contributors}
										</span>
									</div>
								</div>

								{repoData.languages.length > 0 && (
									<div className="mt-3 pt-3 border-t border-[#1E1E1E]">
										<p className="text-[#8C877D] mb-2">
											Languages:
										</p>
										{repoData.languages
											.slice(0, 2)
											.map((lang) => (
												<div
													key={lang.name}
													className="flex items-center justify-between text-[#8C877D]"
												>
													<span>{lang.name}</span>
													<span>
														{lang.percentage}%
													</span>
												</div>
											))}
									</div>
								)}
							</>
						) : null}
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	)
}
