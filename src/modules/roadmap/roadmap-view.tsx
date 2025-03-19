'use client'

import React, { useEffect, useState } from 'react'
import { getRoadmapItems, RoadmapItem } from './api/queries/get-roadmap-items'
import { voteRoadmapItem } from './api/mutations/vote-roadmap-item'
import { ThumbsUp } from 'lucide-react'

type RoadmapQuarter = {
	name: string
	items: RoadmapItem[]
}

const getStatusColor = (status: RoadmapItem['status']) => {
	switch (status) {
		case 'planned':
			return 'bg-blue-500/10 text-blue-400 border-blue-500/20'
		case 'in-progress':
			return 'bg-amber-500/10 text-amber-400 border-amber-500/20'
		case 'completed':
			return 'bg-green-500/10 text-green-400 border-green-500/20'
		default:
			return 'bg-gray-500/10 text-gray-400 border-gray-500/20'
	}
}

const getStatusText = (status: RoadmapItem['status']) => {
	switch (status) {
		case 'planned':
			return 'Planned'
		case 'in-progress':
			return 'In Progress'
		case 'completed':
			return 'Completed'
		default:
			return status
	}
}

const RoadmapView = () => {
	const [quarters, setQuarters] = useState<RoadmapQuarter[]>([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)
	const [votedItems, setVotedItems] = useState<Record<string, boolean>>({})

	useEffect(() => {
		const fetchItems = async () => {
			try {
				const fetchedItems = await getRoadmapItems()

				// Group items by quarter
				const quarterMap = new Map<string, RoadmapItem[]>()

				fetchedItems.forEach((item) => {
					if (!quarterMap.has(item.quarter)) {
						quarterMap.set(item.quarter, [])
					}
					quarterMap.get(item.quarter)!.push(item)
				})

				// Convert map to array sorted by quarter
				const sortedQuarters = Array.from(quarterMap.entries())
					.sort(([aQuarter], [bQuarter]) => {
						// Custom sorting for quarters (Q1 2023, Q2 2023, etc.)
						const [aYear, aQ] = aQuarter.includes('Q')
							? [aQuarter.split(' ')[1], aQuarter.split(' ')[0]]
							: [aQuarter, '']

						const [bYear, bQ] = bQuarter.includes('Q')
							? [bQuarter.split(' ')[1], bQuarter.split(' ')[0]]
							: [bQuarter, '']

						if (aYear !== bYear)
							return Number(aYear) - Number(bYear)
						return aQ.localeCompare(bQ)
					})
					.map(([name, items]) => ({ name, items }))

				setQuarters(sortedQuarters)

				// Get voted items from localStorage
				const storedVotes = localStorage.getItem('roadmap_votes')
				if (storedVotes) {
					setVotedItems(JSON.parse(storedVotes))
				}
			} catch (err) {
				setError('Failed to load roadmap items')
				console.error(err)
			} finally {
				setLoading(false)
			}
		}

		fetchItems()
	}, [])

	const handleVote = async (id: string) => {
		try {
			const isVoted = votedItems[id]
			const operation = isVoted ? 'remove' : 'upvote'

			const result = await voteRoadmapItem({
				roadmapId: id,
				operation,
			})

			if (result.success && result.newVoteCount !== undefined) {
				// Update items with new vote count
				setQuarters(
					quarters.map((quarter) => ({
						...quarter,
						items: quarter.items.map((item) =>
							item.id === id
								? { ...item, votes: result.newVoteCount! }
								: item
						),
					}))
				)

				// Update voted items
				const newVotedItems = { ...votedItems }
				if (operation === 'upvote') {
					newVotedItems[id] = true
				} else {
					delete newVotedItems[id]
				}

				setVotedItems(newVotedItems)
				localStorage.setItem(
					'roadmap_votes',
					JSON.stringify(newVotedItems)
				)
			}
		} catch (err) {
			console.error('Failed to vote:', err)
		}
	}

	if (loading) {
		return (
			<div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
				<div className="max-w-4xl mx-auto">
					<h1 className="text-4xl font-bold text-white mb-4">
						Roadmap
					</h1>
					<p className="text-zinc-400 mb-12">
						Our development plans for improving Roll Your Own Auth.
					</p>
					<div className="space-y-16">
						<div className="bg-zinc-900/50 animate-pulse h-40 rounded-lg"></div>
						<div className="bg-zinc-900/50 animate-pulse h-40 rounded-lg"></div>
					</div>
				</div>
			</div>
		)
	}

	if (error) {
		return (
			<div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
				<div className="max-w-4xl mx-auto">
					<h1 className="text-4xl font-bold text-white mb-4">
						Roadmap
					</h1>
					<p className="text-zinc-400 mb-12">
						Our development plans for improving Roll Your Own Auth.
					</p>
					<div className="bg-red-900/20 border border-red-800 rounded-lg p-6 text-red-400">
						{error}
					</div>
				</div>
			</div>
		)
	}

	return (
		<div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
			<div className="max-w-4xl mx-auto">
				<h1 className="text-4xl font-bold text-white mb-4">Roadmap</h1>
				<p className="text-zinc-400 mb-12">
					Our development plans for improving Roll Your Own Auth.
				</p>

				<div className="space-y-16">
					{quarters.length === 0 ? (
						<div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6 text-center">
							<p className="text-zinc-400">
								No roadmap items available yet.
							</p>
						</div>
					) : (
						quarters.map((quarter) => (
							<div key={quarter.name}>
								<h2 className="text-2xl font-semibold text-white mb-6 border-b border-zinc-800 pb-2">
									{quarter.name}
								</h2>
								<div className="grid gap-6">
									{quarter.items.map((item) => (
										<div
											key={item.id}
											className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6"
										>
											<div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 gap-2">
												<div className="flex items-center gap-2">
													<h3 className="text-xl font-medium text-white">
														{item.title}
													</h3>
													<div
														className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(item.status)}`}
													>
														{getStatusText(
															item.status
														)}
													</div>
												</div>
												<button
													onClick={() =>
														handleVote(item.id)
													}
													className={`flex items-center gap-1 px-2 py-1 rounded ${
														votedItems[item.id]
															? 'bg-blue-900/20 text-blue-400 border border-blue-800/30'
															: 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
													}`}
												>
													<ThumbsUp size={14} />
													<span>
														{item.votes || 0}
													</span>
												</button>
											</div>
											<p className="text-zinc-400">
												{item.description}
											</p>
										</div>
									))}
								</div>
							</div>
						))
					)}
				</div>
			</div>
		</div>
	)
}

export default RoadmapView
