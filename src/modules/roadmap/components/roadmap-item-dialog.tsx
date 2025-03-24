'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { RoadmapItem, RoadmapStatus, RoadmapPriority, RoadmapCategory } from '../types'
import { formatDate } from '../utils/format-date'
import { X, Calendar, Tag, MessageSquare, User, ArrowUp } from 'lucide-react'

interface RoadmapItemDialogProps {
	item: RoadmapItem | null
	isOpen: boolean
	isAdmin: boolean
	onClose: () => void
	onUpdate: (id: string, data: Partial<RoadmapItem>) => Promise<void>
}

export function RoadmapItemDialog({ item, isOpen, isAdmin, onClose, onUpdate }: RoadmapItemDialogProps) {
	const [isEditing, setIsEditing] = useState(false)
	const [formData, setFormData] = useState<Partial<RoadmapItem>>({})
	const [isSubmitting, setIsSubmitting] = useState(false)
	const [error, setError] = useState<string | null>(null)

	// Reset form when item changes
	useEffect(() => {
		if (item) {
			setFormData({
				title: item.title,
				description: item.description,
				status: item.status,
				priority: item.priority,
				category: item.category,
				tags: [...item.tags],
			})
		}
		setIsEditing(false)
		setError(null)
	}, [item])

	const handleSubmit = async () => {
		if (!item || !isAdmin) return

		setIsSubmitting(true)
		setError(null)

		try {
			await onUpdate(item.id, formData)
			setIsEditing(false)
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Failed to update item')
		} finally {
			setIsSubmitting(false)
		}
	}

	const handleVote = async () => {
		if (!item) return
		try {
			await onUpdate(item.id, { votes: item.votes + 1 })
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Failed to vote')
		}
	}

	if (!item) return null

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

	// Get color based on status
	const getStatusColor = (status: string) => {
		switch (status) {
			case 'planned':
				return 'bg-blue-500/10 text-blue-400'
			case 'in-progress':
				return 'bg-yellow-500/10 text-yellow-400'
			case 'completed':
				return 'bg-green-500/10 text-green-400'
			case 'cancelled':
				return 'bg-red-500/10 text-red-400'
			default:
				return 'bg-gray-500/10 text-gray-400'
		}
	}

	return (
		<AnimatePresence>
			{isOpen && (
				<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
					<motion.div
						className="relative w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-lg border border-[#1E1E1E] bg-[#0D0C0C] shadow-xl"
						initial={{ opacity: 0, scale: 0.95 }}
						animate={{ opacity: 1, scale: 1 }}
						exit={{ opacity: 0, scale: 0.95 }}
						transition={{ duration: 0.2 }}
					>
						{/* Close button */}
						<button
							className="absolute top-4 right-4 p-1 rounded-full hover:bg-[#1E1E1E] transition-colors"
							onClick={onClose}
						>
							<X className="h-5 w-5 text-[#8C877D]" />
						</button>

						<div className="overflow-y-auto max-h-[90vh] custom-scrollbar">
							{/* Header */}
							<div className="p-6 border-b border-[#1E1E1E]">
								{isEditing ? (
									<div className="space-y-4">
										<input
											type="text"
											value={formData.title || ''}
											onChange={(e) => setFormData({ ...formData, title: e.target.value })}
											className="w-full px-3 py-2 bg-[#1E1E1E] border border-[#2D2D2D] rounded-md text-[#F2F0ED] focus:outline-none focus:ring-1 focus:ring-[#4e9815]"
											placeholder="Title"
										/>

										<div className="grid grid-cols-3 gap-4">
											<div>
												<label className="block text-xs text-[#8C877D] mb-1">Status</label>
												<select
													value={formData.status || ''}
													onChange={(e) =>
														setFormData({
															...formData,
															status: e.target.value as RoadmapStatus,
														})
													}
													className="w-full px-3 py-2 bg-[#1E1E1E] border border-[#2D2D2D] rounded-md text-[#F2F0ED] focus:outline-none focus:ring-1 focus:ring-[#4e9815]"
												>
													<option value="planned">Planned</option>
													<option value="in-progress">In Progress</option>
													<option value="completed">Completed</option>
													<option value="cancelled">Cancelled</option>
												</select>
											</div>

											<div>
												<label className="block text-xs text-[#8C877D] mb-1">Priority</label>
												<select
													value={formData.priority || ''}
													onChange={(e) =>
														setFormData({
															...formData,
															priority: e.target.value as RoadmapPriority,
														})
													}
													className="w-full px-3 py-2 bg-[#1E1E1E] border border-[#2D2D2D] rounded-md text-[#F2F0ED] focus:outline-none focus:ring-1 focus:ring-[#4e9815]"
												>
													<option value="low">Low</option>
													<option value="medium">Medium</option>
													<option value="high">High</option>
													<option value="critical">Critical</option>
												</select>
											</div>

											<div>
												<label className="block text-xs text-[#8C877D] mb-1">Category</label>
												<select
													value={formData.category || ''}
													onChange={(e) =>
														setFormData({
															...formData,
															category: e.target.value as RoadmapCategory,
														})
													}
													className="w-full px-3 py-2 bg-[#1E1E1E] border border-[#2D2D2D] rounded-md text-[#F2F0ED] focus:outline-none focus:ring-1 focus:ring-[#4e9815]"
												>
													<option value="feature">Feature</option>
													<option value="improvement">Improvement</option>
													<option value="bugfix">Bugfix</option>
													<option value="security">Security</option>
													<option value="performance">Performance</option>
													<option value="documentation">Documentation</option>
												</select>
											</div>
										</div>
									</div>
								) : (
									<div className="flex justify-between items-start">
										<h2 className="text-xl font-medium text-[#F2F0ED]">{item.title}</h2>
										<button
											className="flex items-center gap-1 px-3 py-1 rounded-md hover:bg-[#1E1E1E] transition-colors"
											onClick={handleVote}
										>
											<ArrowUp className="h-4 w-4 text-[#4e9815]" />
											<span className="text-[#8C877D]">{item.votes}</span>
										</button>
									</div>
								)}
							</div>

							{/* Content */}
							<div className="p-6">
								{/* Tags */}
								<div className="flex flex-wrap gap-2 mb-4">
									<span className={`text-xs px-2 py-0.5 rounded-full ${getStatusColor(item.status)}`}>
										{item.status.replace('-', ' ')}
									</span>
									<span
										className={`text-xs px-2 py-0.5 rounded-full ${getPriorityColor(item.priority)}`}
									>
										{item.priority}
									</span>
									<span
										className={`text-xs px-2 py-0.5 rounded-full ${getCategoryColor(item.category)}`}
									>
										{item.category}
									</span>
								</div>

								{/* Description */}
								{isEditing ? (
									<textarea
										value={formData.description || ''}
										onChange={(e) => setFormData({ ...formData, description: e.target.value })}
										className="w-full h-40 px-3 py-2 bg-[#1E1E1E] border border-[#2D2D2D] rounded-md text-[#F2F0ED] focus:outline-none focus:ring-1 focus:ring-[#4e9815] mb-4"
										placeholder="Description"
									/>
								) : (
									<div className="mb-6">
										<h3 className="text-sm font-medium text-[#F2F0ED] mb-2">Description</h3>
										<p className="text-sm text-[#8C877D] whitespace-pre-line">{item.description}</p>
									</div>
								)}

								{/* Tags */}
								{isEditing ? (
									<div className="mb-4">
										<label className="block text-xs text-[#8C877D] mb-1">
											Tags (comma separated)
										</label>
										<input
											type="text"
											value={(formData.tags || []).join(', ')}
											onChange={(e) =>
												setFormData({
													...formData,
													tags: e.target.value
														.split(',')
														.map((tag) => tag.trim())
														.filter(Boolean),
												})
											}
											className="w-full px-3 py-2 bg-[#1E1E1E] border border-[#2D2D2D] rounded-md text-[#F2F0ED] focus:outline-none focus:ring-1 focus:ring-[#4e9815]"
											placeholder="authentication, security, ux"
										/>
									</div>
								) : (
									<div className="mb-6">
										<h3 className="text-sm font-medium text-[#F2F0ED] mb-2 flex items-center gap-1">
											<Tag className="h-4 w-4" />
											Tags
										</h3>
										<div className="flex flex-wrap gap-2">
											{item.tags.length > 0 ? (
												item.tags.map((tag) => (
													<span
														key={tag}
														className="text-xs px-2 py-0.5 rounded-full bg-[#1E1E1E] text-[#8C877D]"
													>
														{tag}
													</span>
												))
											) : (
												<span className="text-xs text-[#8C877D]">No tags</span>
											)}
										</div>
									</div>
								)}

								{/* Metadata */}
								{!isEditing && (
									<div className="grid grid-cols-2 gap-4 mb-6">
										<div>
											<h3 className="text-sm font-medium text-[#F2F0ED] mb-2 flex items-center gap-1">
												<User className="h-4 w-4" />
												Created by
											</h3>
											<p className="text-sm text-[#8C877D]">{item.createdBy}</p>
											<p className="text-xs text-[#8C877D]">{formatDate(item.createdAt)}</p>
										</div>

										{item.dueDate && (
											<div>
												<h3 className="text-sm font-medium text-[#F2F0ED] mb-2 flex items-center gap-1">
													<Calendar className="h-4 w-4" />
													Due date
												</h3>
												<p className="text-sm text-[#8C877D]">{formatDate(item.dueDate)}</p>
											</div>
										)}
									</div>
								)}

								{/* Comments */}
								{!isEditing && item.comments.length > 0 && (
									<div className="mb-6">
										<h3 className="text-sm font-medium text-[#F2F0ED] mb-2 flex items-center gap-1">
											<MessageSquare className="h-4 w-4" />
											Comments ({item.comments.length})
										</h3>
										<div className="space-y-3">
											{item.comments.map((comment) => (
												<div
													key={comment.id}
													className="p-3 rounded-md bg-[#1E1E1E]"
												>
													<p className="text-sm text-[#F2F0ED] mb-1">{comment.content}</p>
													<div className="flex items-center justify-between text-xs text-[#8C877D]">
														<span>{comment.createdBy}</span>
														<span>{formatDate(comment.createdAt)}</span>
													</div>
												</div>
											))}
										</div>
									</div>
								)}

								{/* Error message */}
								{error && (
									<div className="mb-4 p-3 rounded-md bg-red-500/10 text-red-400 text-sm">
										{error}
									</div>
								)}

								{/* Action buttons */}
								<div className="flex justify-end gap-3 mt-6">
									{isEditing ? (
										<>
											<button
												className="px-4 py-2 rounded-md border border-[#1E1E1E] text-[#8C877D] hover:bg-[#1E1E1E] transition-colors"
												onClick={() => setIsEditing(false)}
												disabled={isSubmitting}
											>
												Cancel
											</button>
											<button
												className="px-4 py-2 rounded-md bg-[#4e9815]/20 text-[#4e9815] border border-[#4e9815]/30 hover:bg-[#4e9815]/30 transition-colors"
												onClick={handleSubmit}
												disabled={isSubmitting}
											>
												{isSubmitting ? 'Saving...' : 'Save Changes'}
											</button>
										</>
									) : (
										isAdmin && (
											<button
												className="px-4 py-2 rounded-md bg-[#1E1E1E] text-[#F2F0ED] hover:bg-[#2D2D2D] transition-colors"
												onClick={() => setIsEditing(true)}
											>
												Edit
											</button>
										)
									)}
								</div>
							</div>
						</div>

						{/* Matrix-inspired border effect */}
						<div className="h-1 w-full bg-gradient-to-r from-[#4e9815] to-transparent opacity-30" />
					</motion.div>
				</div>
			)}
		</AnimatePresence>
	)
}
