'use client'

import { motion } from 'framer-motion'
import { GitCommit, GitBranch, GitPullRequest } from 'lucide-react'

export function RoadmapHeader() {
	return (
		<motion.div
			className="mb-8"
			initial={{ opacity: 0, y: -20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}
		>
			<div className="flex items-center gap-2 text-sm text-[#8C877D] mb-2">
				<GitBranch className="h-4 w-4" />
				<span>main</span>
				<span>/</span>
				<GitCommit className="h-4 w-4" />
				<span>roadmap</span>
			</div>

			<div className="flex items-center justify-between">
				<h1 className="text-3xl font-bold bg-gradient-to-b from-[#F2F0ED] to-[#ADADAD] bg-clip-text text-transparent">
					Project Roadmap
				</h1>

				<div className="flex items-center gap-3">
					<div className="flex items-center gap-1 text-sm text-[#8C877D]">
						<GitPullRequest className="h-4 w-4 text-[#4e9815]" />
						<span>Last updated: March 15, 2024</span>
					</div>
				</div>
			</div>

			<p className="mt-2 text-[#8C877D] max-w-3xl">
				Track the development of Roll Your Own Auth features and improvements. Vote for items you'd like to see
				prioritized.
				{/* Only admins can edit the roadmap. */}
			</p>
		</motion.div>
	)
}
