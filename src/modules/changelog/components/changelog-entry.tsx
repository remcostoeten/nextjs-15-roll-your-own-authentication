'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ExternalLink, ChevronDown, ChevronUp } from 'lucide-react'
import type { ChangelogEntry as ChangelogEntryType } from '../types/changelog'
import { VoteButton } from './vote-button'
import { AdminVoterData } from './admin-voter-data' // Import the new component

interface ChangelogEntryProps {
	entry: ChangelogEntryType
	isAdmin?: boolean // Add isAdmin prop
}

const categoryColors: Record<string, { bg: string; text: string }> = {
	feature: { bg: 'bg-blue-500/10', text: 'text-blue-400' },
	improvement: { bg: 'bg-purple-500/10', text: 'text-purple-400' },
	bugfix: { bg: 'bg-green-500/10', text: 'text-green-400' },
	security: { bg: 'bg-red-500/10', text: 'text-red-400' },
	performance: { bg: 'bg-yellow-500/10', text: 'text-yellow-400' },
	documentation: { bg: 'bg-gray-500/10', text: 'text-gray-400' },
	breaking: { bg: 'bg-orange-500/10', text: 'text-orange-400' },
}

export function ChangelogEntry({ entry, isAdmin = false }: ChangelogEntryProps) {
	const [expanded, setExpanded] = useState(false)

	const formatDate = (dateString: string) => {
		const date = new Date(dateString)
		return date.toLocaleDateString('en-US', {
			day: 'numeric',
			month: 'short',
			year: 'numeric',
		})
	}

	return (
		<motion.div
			className="border border-[#1E1E1E] rounded-lg overflow-hidden bg-[#0D0C0C]/50 mb-6"
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.3 }}
		>
			<div
				className="p-4 cursor-pointer flex items-start justify-between"
				onClick={() => setExpanded(!expanded)}
			>
				<div className="flex-1">
					<div className="flex items-center gap-2 mb-2">
						<span className="text-xs text-[#8C877D]">{formatDate(entry.date)}</span>
						{entry.version && (
							<span className="text-xs px-2 py-0.5 rounded-full bg-[#1E1E1E] text-[#8C877D]">
								v{entry.version}
							</span>
						)}
					</div>

					<h3 className="text-lg font-medium text-[#F2F0ED] mb-2">{entry.title}</h3>

					<div className="flex flex-wrap gap-2">
						{entry.categories.map((category) => (
							<span
								key={category}
								className={`text-xs px-2 py-0.5 rounded-full ${categoryColors[category].bg} ${categoryColors[category].text}`}
							>
								{category}
							</span>
						))}
					</div>
				</div>

				<div className="flex items-center gap-2">
					{/* Add the VoteButton component */}
					<VoteButton entryId={entry.id} />

					<button className="text-[#8C877D] p-1 hover:text-[#F2F0ED] transition-colors">
						{expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
					</button>
				</div>
			</div>

			{expanded && (
				<motion.div
					className="px-4 pb-4 border-t border-[#1E1E1E] pt-3"
					initial={{ opacity: 0, height: 0 }}
					animate={{ opacity: 1, height: 'auto' }}
					exit={{ opacity: 0, height: 0 }}
					transition={{ duration: 0.2 }}
				>
					<p className="text-[#8C877D] mb-3">{entry.description}</p>

					<div className="flex items-center justify-between">
						{entry.author && <span className="text-xs text-[#8C877D]">By {entry.author}</span>}

						{entry.githubUrl && (
							<a
								href={entry.githubUrl}
								target="_blank"
								rel="noopener noreferrer"
								className="text-xs flex items-center gap-1 text-[#4e9815] hover:underline"
							>
								View on GitHub <ExternalLink size={12} />
							</a>
						)}
					</div>

					{/* Add the AdminVoterData component */}
					<AdminVoterData
						entryId={entry.id}
						isAdmin={isAdmin}
					/>
				</motion.div>
			)}
		</motion.div>
	)
}
