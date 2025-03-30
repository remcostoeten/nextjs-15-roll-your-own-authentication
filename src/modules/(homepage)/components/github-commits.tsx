'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGithubCommits } from '@/modules/github/hooks/use-github-data'
import { formatDate } from '@/shared/utils/date'

interface GitHubCommitsProps {
	owner?: string
	repo?: string
	count?: number
}

export function GitHubCommits({
	owner = 'remcostoeten',
	repo = 'nextjs-15-roll-your-own-authentication',
	count = 5
}: GitHubCommitsProps) {
	const [activeSquare, setActiveSquare] = useState<number | null>(null)
	const tooltipRef = useRef<HTMLDivElement>(null)
	const { data: commits, isLoading, error, source } = useGithubCommits(owner, repo, count)

	// Format commit message to show only the first line
	const formatMessage = (message: string) => {
		return message.split('\n')[0]
	}

	// Handle click outside tooltip
	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (tooltipRef.current && !tooltipRef.current.contains(event.target as Node)) {
				setActiveSquare(null)
			}
		}

		document.addEventListener('mousedown', handleClickOutside)
		return () => document.removeEventListener('mousedown', handleClickOutside)
	}, [])

	return (
		<div className="flex items-center gap-1">
			{isLoading ? (
				// Loading skeleton
				Array.from({ length: count }).map((_, index) => (
					<div
						key={index}
						className="h-4 w-4 rounded bg-[#1E1E1E] animate-pulse"
					></div>
				))
			) : error ? (
				// Error state
				<div className="text-red-400 text-xs">Failed to load commits</div>
			) : (
				// Commit squares
				commits.map((commit, index) => (
					<div
						key={commit.sha}
						className="relative"
					>
						<motion.div
							className={`h-4 w-4 rounded cursor-pointer transition-colors ${
								activeSquare === index
									? 'bg-[#4e9815]'
									: 'bg-[#1E1E1E] hover:bg-[#2E2E2E]'
							}`}
							whileHover={{ scale: 1.1 }}
							whileTap={{ scale: 0.95 }}
							onClick={() => setActiveSquare(activeSquare === index ? null : index)}
						/>

						<AnimatePresence>
							{activeSquare === index && (
								<motion.div
									ref={tooltipRef}
									initial={{ opacity: 0, y: 10 }}
									animate={{ opacity: 1, y: 0 }}
									exit={{ opacity: 0, y: 10 }}
									className="absolute top-full left-0 z-[9999] w-64 rounded border border-[#1E1E1E] bg-[#0D0C0C] p-3 text-xs shadow-lg mt-2"
								>
									{/* Arrow */}
									<div className="absolute left-2 h-2 w-2 rotate-45 border border-[#1E1E1E] bg-[#0D0C0C] -top-1 border-r-0 border-b-0" />

									<p className="mb-1 text-[#8C877D]">{commit.sha.substring(0, 7)}</p>
									<p className="mb-2 text-[#F2F0ED]">{formatMessage(commit.commit.message)}</p>
									<div className="flex items-center gap-2 text-[#8C877D]">
										{commit.author?.avatar_url && (
											<img
												src={commit.author.avatar_url}
												alt={commit.author.login}
												className="h-4 w-4 rounded-full"
											/>
										)}
										<span>
											{commit.author?.login || commit.commit.author.name} • {formatDate(commit.commit.author.date)}
										</span>
									</div>
									<a
										href={commit.html_url}
										target="_blank"
										rel="noopener noreferrer"
										className="mt-2 block text-[#4e9815] hover:underline"
									>
										View on GitHub
									</a>

									{source === 'fallback' && (
										<p className="mt-2 text-[10px] text-[#8C877D] italic">
											Using fallback data
										</p>
									)}
								</motion.div>
							)}
						</AnimatePresence>
					</div>
				))
			)}
		</div>
	)
}
