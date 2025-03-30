'use client'

import { useRef, useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useGithubData } from '@/modules/github/hooks/use-github-data'
import { formatDate } from '@/shared/utils/date'

interface GitHubRepoCardProps {
	owner?: string
	repo?: string
}

export function GitHubRepoCard({
	owner = 'remcostoeten',
	repo = 'nextjs-15-roll-your-own-authentication',
}: GitHubRepoCardProps) {
	const { 
		repo: repoData, 
		languages, 
		commits,
		isLoading,
		error,
		source 
	} = useGithubData({ owner, repo })

	// Refs for positioning
	const cardRef = useRef<HTMLDivElement>(null)
	const [position, setPosition] = useState<'top' | 'bottom'>('top')

	// Check if card would go out of viewport and adjust position
	useEffect(() => {
		if (!cardRef.current) return

		const updatePosition = () => {
			const rect = cardRef.current?.getBoundingClientRect()
			if (!rect) return

			// Check if the card would go out of the viewport at the bottom
			const viewportHeight = window.innerHeight
			const wouldOverflowBottom = rect.bottom > viewportHeight

			// If it would overflow at the bottom, position it above
			setPosition(wouldOverflowBottom ? 'top' : 'bottom')
		}

		// Update position on mount
		updatePosition()

		// Update position on resize
		window.addEventListener('resize', updatePosition)
		return () => window.removeEventListener('resize', updatePosition)
	}, [])

	if (isLoading) {
		return (
			<motion.div
				ref={cardRef}
				className="w-96 rounded-lg border border-[#1E1E1E] bg-[#0D0C0C] p-4 shadow-xl"
				initial={{ opacity: 0, y: 10 }}
				animate={{ opacity: 1, y: 0 }}
				exit={{ opacity: 0, y: 10 }}
			>
				<div className="animate-pulse">
					<div className="h-4 w-3/4 bg-[#1E1E1E] rounded mb-2"></div>
					<div className="h-3 w-1/2 bg-[#1E1E1E] rounded mb-4"></div>
					<div className="space-y-2">
						<div className="h-2 bg-[#1E1E1E] rounded"></div>
						<div className="h-2 bg-[#1E1E1E] rounded"></div>
					</div>
				</div>
			</motion.div>
		)
	}

	if (error || !repoData) {
		return (
			<motion.div
				ref={cardRef}
				className="w-96 rounded-lg border border-[#1E1E1E] bg-[#0D0C0C] p-4 shadow-xl text-red-400"
				initial={{ opacity: 0, y: 10 }}
				animate={{ opacity: 1, y: 0 }}
				exit={{ opacity: 0, y: 10 }}
			>
				<p>Error loading repository data</p>
				{error && <p className="text-xs mt-1">{error}</p>}
			</motion.div>
		)
	}

	const latestCommit = commits[0]

	return (
		<motion.div
			ref={cardRef}
			className="w-96 rounded-lg border border-[#1E1E1E] bg-[#0D0C0C] p-4 shadow-xl"
			initial={{ opacity: 0, y: 10 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, y: 10 }}
		>
			<h3 className="text-lg font-medium text-[#F2F0ED] mb-2">{repoData.name}</h3>
			<p className="text-sm text-[#8C877D] mb-4">{repoData.description}</p>

			{/* Repository stats */}
			<div className="mb-4 grid grid-cols-2 gap-4 text-sm">
				<div className="flex items-center gap-1">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						className="w-4 h-4"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
					>
						<path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2z" />
					</svg>
					<span>Stars: {repoData.stargazers_count}</span>
				</div>

				<div className="flex items-center gap-1">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						className="w-4 h-4"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
					>
						<path d="M7 7H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h3" />
						<path d="M7 7v10" />
						<path d="M20 7h3a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-3" />
						<path d="M20 7v10" />
						<path d="M8 7h8" />
						<path d="M8 17h8" />
						<path d="M7 12h13" />
					</svg>
					<span>Forks: {repoData.forks_count}</span>
				</div>
			</div>

			{/* Language bars */}
			{languages && Object.entries(languages).length > 0 && (
				<div className="mb-3">
					{Object.entries(languages).map(([language, percentage], index) => (
						<div
							key={language}
							className="mb-1"
						>
							<div className="flex justify-between text-xs mb-1">
								<span className={`${
									language === 'TypeScript' ? 'text-blue-400' :
									language === 'Shell' ? 'text-green-400' :
									'text-yellow-400'
								}`}>
									{language}
								</span>
								<span className="text-[#8C877D]">{percentage}%</span>
							</div>
							<div className="w-full bg-[#1E1E1E] rounded-full h-1.5">
								<div
									className={`h-1.5 rounded-full ${
										language === 'TypeScript' ? 'bg-blue-400' :
										language === 'Shell' ? 'bg-green-400' :
										'bg-yellow-400'
									}`}
									style={{ width: `${percentage}%` }}
								></div>
							</div>
						</div>
					))}
				</div>
			)}

			<a
				href={repoData.html_url}
				target="_blank"
				rel="noopener noreferrer"
				className="text-[#4e9815] hover:underline text-xs inline-block mb-3"
			>
				View on GitHub
			</a>

			<div className="text-xs text-[#8C877D] border-t border-[#1E1E1E] pt-2">
				<div className="flex items-center gap-1">
					<span>git:</span>
					<span className="text-[#4e9815]">({repoData.default_branch})</span>
					<span>&gt;{repoData.full_name.split('/')[1]}</span>
				</div>
				{latestCommit && (
					<div className="mt-1">
						<span>$ Latest commit: </span>
						<span className="text-[#4e9815]">
							{latestCommit.commit.message.split('\n')[0]}
						</span>
					</div>
				)}
			</div>

			{source === 'fallback' && (
				<p className="mt-2 text-[10px] text-[#8C877D] italic">Using fallback data</p>
			)}
		</motion.div>
	)
}
