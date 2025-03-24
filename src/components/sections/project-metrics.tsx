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

interface ProjectMetricsProps {
	children: React.ReactNode
}

export function ProjectMetrics({ children }: ProjectMetricsProps) {
	const [isHovered, setIsHovered] = useState(false)
	const triggerRef = useRef<HTMLDivElement>(null)

	// Project metrics data
	const projectData = {
		name: 'nextjs-15-roll-your-own-authentication',
		owner: 'remcostoeten',
		description:
			'Showcasing how to roll your own JWT auth without external services',
		created: 'November 10, 2023',
		lastUpdated: 'March 9, 2024',
		stars: 3,
		forks: 0,
		commits: 20,
		branches: 1,
		contributors: 1,
		mainLanguage: 'TypeScript (72.4%)',
		secondaryLanguage: 'Shell (20.9%)',
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

						<h3 className="mb-2 text-sm font-medium text-[#F2F0ED]">
							{projectData.name}
						</h3>
						<p className="mb-3 text-[#8C877D]">
							{projectData.description}
						</p>

						<div className="grid grid-cols-2 gap-3">
							<div className="flex items-center gap-2 text-[#8C877D]">
								<Calendar className="h-3.5 w-3.5" />
								<span>Created: {projectData.created}</span>
							</div>

							<div className="flex items-center gap-2 text-[#8C877D]">
								<GitCommit className="h-3.5 w-3.5" />
								<span>Commits: {projectData.commits}</span>
							</div>

							<div className="flex items-center gap-2 text-[#8C877D]">
								<Star className="h-3.5 w-3.5" />
								<span>Stars: {projectData.stars}</span>
							</div>

							<div className="flex items-center gap-2 text-[#8C877D]">
								<GitFork className="h-3.5 w-3.5" />
								<span>Forks: {projectData.forks}</span>
							</div>

							<div className="flex items-center gap-2 text-[#8C877D]">
								<GitBranch className="h-3.5 w-3.5" />
								<span>Branches: {projectData.branches}</span>
							</div>

							<div className="flex items-center gap-2 text-[#8C877D]">
								<Users className="h-3.5 w-3.5" />
								<span>
									Contributors: {projectData.contributors}
								</span>
							</div>
						</div>

						<div className="mt-3 space-y-1">
							<div className="flex items-center justify-between">
								<span className="text-[#8C877D]">
									TypeScript
								</span>
								<span className="text-[#8C877D]">72.4%</span>
							</div>
							<div className="h-1.5 w-full overflow-hidden rounded-full bg-[#1E1E1E]">
								<div className="h-full w-[72.4%] bg-[#3178c6] rounded-full"></div>
							</div>

							<div className="flex items-center justify-between">
								<span className="text-[#8C877D]">Shell</span>
								<span className="text-[#8C877D]">20.9%</span>
							</div>
							<div className="h-1.5 w-full overflow-hidden rounded-full bg-[#1E1E1E]">
								<div className="h-full w-[20.9%] bg-[#89e051] rounded-full"></div>
							</div>
						</div>

						<a
							href="https://github.com/remcostoeten/nextjs-15-roll-your-own-authentication"
							target="_blank"
							rel="noopener noreferrer"
							className="mt-3 block text-[#4e9815] hover:underline"
						>
							View on GitHub
						</a>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	)
}
