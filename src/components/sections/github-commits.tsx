'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Commit {
	sha: string
	message: string
	author: string
	authorAvatar: string
	date: string
	url: string
}

// Cache key for localStorage
const CACHE_KEY = 'github-commits-cache'
const CACHE_EXPIRY_KEY = 'github-commits-cache-expiry'
const CACHE_DURATION = 60 * 60 * 1000 // 1 hour in milliseconds

export function GitHubCommits() {
	const [activeSquare, setActiveSquare] = useState<number | null>(null)
	const [tooltipPosition, setTooltipPosition] = useState<'top' | 'bottom'>(
		'top'
	) // Default to top
	const [commits, setCommits] = useState<Commit[]>([])
	const [isLoading, setIsLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)
	const [dataSource, setDataSource] = useState<
		'api' | 'cache' | 'fallback' | null
	>(null)

	// Fix the ref type declaration
	const squareRefs = useRef<Array<HTMLDivElement | null>>([])
	const tooltipRef = useRef<HTMLDivElement | null>(null)

	// Define opacity values for the fade-out effect with green color
	const squares = [
		{ opacity: 1, bg: 'bg-[#4e9815]' },
		{ opacity: 0.75, bg: 'bg-[#4e9815]/75' },
		{ opacity: 0.5, bg: 'bg-[#4e9815]/50' },
		{ opacity: 0.25, bg: 'bg-[#4e9815]/25' },
		{ opacity: 0.1, bg: 'bg-[#4e9815]/10' },
	]

	// Fallback commits in case the API fails
	const fallbackCommits = [
		{
			sha: 'abcd1234',
			message: 'Implement JWT authentication',
			author: 'remcostoeten',
			authorAvatar: '',
			date: '2023-11-15T10:30:00Z',
			url: 'https://github.com/remcostoeten/nextjs-15-roll-your-own-authentication/commit/abcd1234',
		},
		{
			sha: 'efgh5678',
			message: 'Add password hashing utility',
			author: 'remcostoeten',
			authorAvatar: '',
			date: '2023-11-14T14:20:00Z',
			url: 'https://github.com/remcostoeten/nextjs-15-roll-your-own-authentication/commit/efgh5678',
		},
		{
			sha: 'ijkl9012',
			message: 'Create user registration flow',
			author: 'remcostoeten',
			authorAvatar: '',
			date: '2023-11-13T09:15:00Z',
			url: 'https://github.com/remcostoeten/nextjs-15-roll-your-own-authentication/commit/ijkl9012',
		},
		{
			sha: 'mnop3456',
			message: 'Set up database schema',
			author: 'remcostoeten',
			authorAvatar: '',
			date: '2023-11-12T16:45:00Z',
			url: 'https://github.com/remcostoeten/nextjs-15-roll-your-own-authentication/commit/mnop3456',
		},
		{
			sha: 'qrst7890',
			message: 'Initial commit',
			author: 'remcostoeten',
			authorAvatar: '',
			date: '2023-11-10T11:00:00Z',
			url: 'https://github.com/remcostoeten/nextjs-15-roll-your-own-authentication/commit/qrst7890',
		},
	]

	useEffect(() => {
		// For this simplified version, we'll just use the fallback data
		setCommits(fallbackCommits)
		setDataSource('fallback')
		setIsLoading(false)
	}, [])

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
					ref={(el) => (squareRefs.current[index] = el)}
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
								ref={tooltipRef}
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
									<p className="text-[#8C877D]">
										Loading commits...
									</p>
								) : error && dataSource !== 'fallback' ? (
									<p className="text-red-500">{error}</p>
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

										{dataSource === 'fallback' && (
											<p className="mt-2 text-[10px] text-[#8C877D] italic">
												Using sample data (GitHub API
												unavailable)
											</p>
										)}

										{dataSource === 'cache' && (
											<p className="mt-2 text-[10px] text-[#8C877D] italic">
												Using cached data
											</p>
										)}
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
