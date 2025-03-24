'use client'

import { useEffect, useState } from 'react'
import {
	getChangelogItems,
	ChangelogItem,
} from '../../modules/changelog/api/queries/get-changelog-items'
import { voteChangelogItem } from '../../modules/changelog/api/mutations/vote-changelog-item'
import { formatDate } from '@/shared/utils/helpers'
import { ThumbsUp } from 'lucide-react'

const ChangelogView = () => {
	const [items, setItems] = useState<ChangelogItem[]>([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)
	const [votedItems, setVotedItems] = useState<Record<string, boolean>>({})

	useEffect(() => {
		const fetchItems = async () => {
			try {
				const fetchedItems = await getChangelogItems()
				setItems(fetchedItems)

				const storedVotes = localStorage.getItem('changelog_votes')
				if (storedVotes) {
					setVotedItems(JSON.parse(storedVotes))
				}
			} catch (err) {
				setError('Failed to load changelog items')
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

			const result = await voteChangelogItem({
				changelogId: id,
				operation,
			})

			if (result.success && result.newVoteCount !== undefined) {
				// Update items with new vote count
				setItems(
					items.map((item) =>
						item.id === id
							? { ...item, votes: result.newVoteCount! }
							: item
					)
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
					'changelog_votes',
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
				<div className="max-w-3xl mx-auto">
					<h1 className="text-4xl font-bold text-white mb-8">
						Changelog
					</h1>
					<div className="bg-zinc-900/50 animate-pulse h-40 rounded-lg"></div>
				</div>
			</div>
		)
	}

	if (error) {
		return (
			<div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
				<div className="max-w-3xl mx-auto">
					<h1 className="text-4xl font-bold text-white mb-8">
						Changelog
					</h1>
					<div className="bg-red-900/20 border border-red-800 rounded-lg p-6 text-red-400">
						{error}
					</div>
				</div>
			</div>
		)
	}

	return (
		<div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
			<div className="max-w-3xl mx-auto">
				<h1 className="text-4xl font-bold text-white mb-8">
					Changelog
				</h1>

				<div className="space-y-12">
					{items.length === 0 ? (
						<div className="bg-zinc-900/50 border border-zinc-800   rounded-lg p-6 text-center">
							<p className="text-zinc-400">
								No changelog items available yet.
							</p>
						</div>
					) : (
						items.map((item) => (
							<div
								key={item.id}
								className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6"
							>
								<div className="flex items-start justify-between mb-4">
									<div>
										<h2 className="text-xl font-semibold text-white flex items-center gap-2">
											{item.title}
											<span className="text-sm text-zinc-500 font-normal">
												v{item.version}
											</span>
										</h2>
										<p className="text-sm text-zinc-400">
											{formatDate(item.date)}
										</p>
									</div>

									<button
										onClick={() => handleVote(item.id)}
										className={`flex items-center gap-1 px-2 py-1 rounded ${
											votedItems[item.id]
												? 'bg-blue-900/20 text-blue-400 border border-blue-800/30'
												: 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
										}`}
									>
										<ThumbsUp size={14} />
										<span>{item.votes || 0}</span>
									</button>
								</div>

								<p className="text-zinc-300 mb-6">
									{item.description}
								</p>

								<div className="space-y-4">
									{item.features &&
										item.features.length > 0 && (
											<div>
												<h3 className="text-md font-medium text-zinc-300 mb-2">
													Features
												</h3>
												<ul className="list-disc pl-5 space-y-1 text-zinc-400">
													{item.features.map(
														(feature, i) => (
															<li key={i}>
																{feature}
															</li>
														)
													)}
												</ul>
											</div>
										)}

									{item.improvements &&
										item.improvements.length > 0 && (
											<div>
												<h3 className="text-md font-medium text-zinc-300 mb-2">
													Improvements
												</h3>
												<ul className="list-disc pl-5 space-y-1 text-zinc-400">
													{item.improvements.map(
														(improvement, i) => (
															<li key={i}>
																{improvement}
															</li>
														)
													)}
												</ul>
											</div>
										)}

									{item.bugfixes &&
										item.bugfixes.length > 0 && (
											<div>
												<h3 className="text-md font-medium text-zinc-300 mb-2">
													Bug Fixes
												</h3>
												<ul className="list-disc pl-5 space-y-1 text-zinc-400">
													{item.bugfixes.map(
														(bugfix, i) => (
															<li key={i}>
																{bugfix}
															</li>
														)
													)}
												</ul>
											</div>
										)}
								</div>
							</div>
						))
					)}
				</div>
			</div>
		</div>
	)
}

export default ChangelogView
