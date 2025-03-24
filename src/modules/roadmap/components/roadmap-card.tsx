'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import type { RoadmapItem } from '../types'
import { formatRelativeTime } from '../utils/format-date'
import { ArrowUp, MessageSquare, Calendar, Tag } from 'lucide-react'

interface RoadmapCardProps {
	item: RoadmapItem
	isAdmin: boolean
	onVote: (id: string) => Promise<void>
	onEdit: (item: RoadmapItem) => void
}

export function RoadmapCard({ item, isAdmin, onVote, onEdit }: RoadmapCardProps) {
	const [isVoting, setIsVoting] = useState(false)
	const [isHovered, setIsHovered] = useState(false)

	const handleVote = async () => {
		if (isVoting) return
		setIsVoting(true)
		try {
			await onVote(item.id)
		} finally {
			setIsVoting(false)
		}
	}

	// Get color based on priority
	const getPriorityColor = (priority: string) => {
		switch (priority) {
			case 'critical':
				return 'bg-red-500/10 text-red-400'
			case 'high':
				return 'bg-orange-500/10 text-orange-400'
			case 'medium':
				return 'bg-yellow-500/10 text-yellow-400'
			case 'low':
				return 'bg-blue-500/10 text-blue-400'
			default:
				return 'bg-gray-500/10 text-gray-400'
		}
	}

	// Get color based on category
	const getCategoryColor = (category: string) => {
		switch (category) {
			case 'feature':
				return 'bg-purple-500/10 text-purple-400'
			case 'improvement':
				return 'bg-blue-500/10 text-blue-400'
			case 'bugfix':
				return 'bg-green-500/10 text-green-400'
			case 'security':
				return 'bg-red-500/10 text-red-400'
			case 'performance':
				return 'bg-yellow-500/10 text-yellow-400'
			case 'documentation':
				return 'bg-gray-500/10 text-gray-400'
			default:
				return 'bg-gray-500/10 text-gray-400'
		}
	}

	return (
		<motion.div
			className="border border-[#1E1E1E] rounded-lg bg-[#0D0C0C] p-4 mb-4 relative overflow-hidden"
			whileHover={{ y: -3, transition: { duration: 0.2 } }}
			onHoverStart={() => setIsHovered(true)}
			onHoverEnd={() => setIsHovered(false)}
			onClick={() => onEdit(item)}
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.3 }}
		>
			{/* Matrix rain effect on hover */}
			<div
				className={`absolute inset-0 bg-[#0D0C0C] opacity-0 transition-opacity duration-300 ${isHovered ? 'opacity-5' : ''}`}
				style={{
					backgroundImage:
						"url(\"data:image/svg+xml,%3Csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='matrix' width='20' height='20' patternUnits='userSpaceOnUse'%3E%3Ctext x='0' y='15' fontFamily='monospace' fontSize='15' fill='%230f0' opacity='0.3'%3E0%3C/text%3E%3Ctext x='10' y='10' fontFamily='monospace' fontSize='10' fill='%230f0' opacity='0.3'%3E1%3C/text%3E%3C/pattern%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='url(%23matrix)'/%3E%3C/svg%3E\")",
					backgroundSize: '50px 50px',
				}}
			/>

			{/* Spotlight effect on hover */}
			<div
				className={`absolute inset-0 bg-radial-gradient opacity-0 transition-opacity duration-300 ${isHovered ? 'opacity-10' : ''}`}
				style={{
					background: 'radial-gradient(circle at 50% 50%, rgba(15, 255, 15, 0.2) 0%, transparent 70%)',
				}}
			/>

			<div className="relative z-10">
				{/* Header with title and vote button */}
				<div className="flex justify-between items-start mb-2">
					<h3 className="text-lg font-medium text-[#F2F0ED] mr-2">{item.title}</h3>
					<button
						className={`flex items-center gap-1 px-2 py-1 rounded-md transition-colors ${
							isVoting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#1E1E1E]'
						}`}
						onClick={(e) => {
							e.stopPropagation()
							handleVote()
						}}
						disabled={isVoting}
					>
						<ArrowUp className="h-4 w-4 text-[#4e9815]" />
						<span className="text-[#8C877D]">{item.votes}</span>
					</button>
				</div>

				{/* Tags */}
				<div className="flex flex-wrap gap-2 mb-3">
					<span className={`text-xs px-2 py-0.5 rounded-full ${getPriorityColor(item.priority)}`}>
						{item.priority}
					</span>
					<span className={`text-xs px-2 py-0.5 rounded-full ${getCategoryColor(item.category)}`}>
						{item.category}
					</span>
					{item.tags.slice(0, 2).map((tag) => (
						<span
							key={tag}
							className="text-xs px-2 py-0.5 rounded-full bg-[#1E1E1E] text-[#8C877D] flex items-center gap-1"
						>
							<Tag className="h-3 w-3" />
							{tag}
						</span>
					))}
					{item.tags.length > 2 && (
						<span className="text-xs px-2 py-0.5 rounded-full bg-[#1E1E1E] text-[#8C877D]">
							+{item.tags.length - 2} more
						</span>
					)}
				</div>

				{/* Description */}
				<p className="text-sm text-[#8C877D] mb-3 line-clamp-2">{item.description}</p>

				{/* Footer with metadata */}
				<div className="flex items-center justify-between text-xs text-[#8C877D]">
					<div className="flex items-center gap-3">
						{item.comments.length > 0 && (
							<span className="flex items-center gap-1">
								<MessageSquare className="h-3 w-3" />
								{item.comments.length}
							</span>
						)}
						{item.dueDate && (
							<span className="flex items-center gap-1">
								<Calendar className="h-3 w-3" />
								{formatRelativeTime(item.dueDate)}
							</span>
						)}
					</div>
					<span>{formatRelativeTime(item.updatedAt)}</span>
				</div>
			</div>

			{/* Admin edit indicator */}
			{isAdmin && (
				<div className="absolute top-0 right-0 w-0 h-0 border-t-8 border-r-8 border-t-[#4e9815] border-r-transparent" />
			)}
		</motion.div>
	)
}
