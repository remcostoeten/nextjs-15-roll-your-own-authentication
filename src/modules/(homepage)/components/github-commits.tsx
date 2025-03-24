'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGithubData } from '@/modules/github/hooks/use-github-data'

export function GitHubCommits() {
	const [activeSquare, setActiveSquare] = useState<number | null>(null)
	const squareRefs = useRef<Array<HTMLDivElement | null>>([])

	const { commits, isLoading, error } = useGithubData({
		owner: 'remcostoeten',
		repo: 'nextjs-15-roll-your-own-authentication',
	})

	const squares = [
		{ opacity: 1, bg: 'bg-[#4e9815]' },
		{ opacity: 0.75, bg: 'bg-[#4e9815]/75' },
		{ opacity: 0.5, bg: 'bg-[#4e9815]/50' },
		{ opacity: 0.25, bg: 'bg-[#4e9815]/25' },
		{ opacity: 0.1, bg: 'bg-[#4e9815]/10' },
	]

	// Format date to a more readable format
	const formatDate = (dateString: string) => {
		try {
			const date = new Date(dateString)
			return date.toLocaleDateString('en-US', {
				year: 'numeric',
				month: 'short',
				day: 'numeric',
			})
		} catch (e) {
			return dateString
		}
	}

	// Format commit message to show only the first line
	const formatMessage = (message: string) => {
		return message.split('\n')[0]
	}

	return (
		<div className="relative ml-2 flex gap-1">
			{squares.map((square, index) => (
				<div
					key={index}
					className="relative"
					ref={(el) => {
						squareRefs.current[index] = el
					}}
					onMouseEnter={() => setActiveSquare(index)}
					onMouseLeave={() => setActiveSquare(null)}
				>
					<div
						className={`h-4 w-4 rounded cursor-pointer transition-all duration-200 ${
							activeSquare === index ? 'bg-[#4e9815]' : square.bg
						}`}
					/>

					<AnimatePresence>
						{activeSquare === index && (
							<motion.div
								initial={{ opacity: 0, y: -10 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: -10 }}
								className={`
                  absolute bottom-full
                  left-0 z-[9999] w-64 rounded border border-[#1E1E1E] 
                  bg-[#0D0C0C] p-3 text-xs shadow-lg mb-2
                `}
							>
								{/* Arrow */}
								<div
									className={`
                    absolute left-2 h-2 w-2 rotate-45 border border-[#1E1E1E] bg-[#0D0C0C]
                    -bottom-1 border-l-0 border-t-0
                  `}
								/>

								{isLoading ? (
									<div className="flex items-center justify-center py-2">
										<div className="h-5 w-5 animate-spin rounded-full border-2 border-[#4e9815] border-t-transparent" />
									</div>
								) : error ? (
									<div className="text-red-500 py-2">
										{error}
									</div>
								) : commits.length > 0 &&
								  index < commits.length ? (
									<>
										<p className="mb-1 text-[#8C877D]">
											{commits[index].sha.substring(0, 7)}
										</p>
										<p className="mb-2 text-[#F2F0ED]">
											{formatMessage(
												commits[index].message
											)}
										</p>
										<div className="flex items-center gap-2 text-[#8C877D]">
											{commits[index].authorAvatar && (
												<img
													src={
														commits[index]
															.authorAvatar ||
														'/placeholder.svg'
													}
													alt={commits[index].author}
													className="h-4 w-4 rounded-full"
												/>
											)}
											<span>
												{commits[index].author} •{' '}
												{formatDate(
													commits[index].date
												)}
											</span>
										</div>
										<a
											href={commits[index].url}
											target="_blank"
											rel="noopener noreferrer"
											className="mt-2 block text-[#4e9815] hover:underline"
										>
											View on GitHub
										</a>
									</>
								) : (
									<p className="text-[#8C877D]">
										No commit data available
									</p>
								)}
							</motion.div>
						)}
					</AnimatePresence>
				</div>
			))}
		</div>
	)
}
