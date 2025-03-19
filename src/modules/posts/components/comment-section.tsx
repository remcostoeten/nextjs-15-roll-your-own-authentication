'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import { User } from '@/server/db/schemas/users'
import { createComment, deleteComment } from '@/modules/posts/api/mutations'
import { getComments } from '@/modules/posts/api/queries'
import { formatDistanceToNow } from 'date-fns'
import { Heart, Reply, Trash2 } from 'lucide-react'

interface CommentSectionProps {
	postId: string
	currentUser: User | null
}

export function CommentSection({ postId, currentUser }: CommentSectionProps) {
	const [comments, setComments] = useState<any[]>([])
	const [isLoading, setIsLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)
	const [newComment, setNewComment] = useState('')
	const [replyToId, setReplyToId] = useState<string | null>(null)
	const [isSubmitting, setIsSubmitting] = useState(false)

	const commentInputRef = useRef<HTMLTextAreaElement>(null)

	// Initial load of comments
	const loadComments = useCallback(async () => {
		try {
			setIsLoading(true)
			setError(null)

			const commentsData = await getComments({
				postId,
				includeReplies: true,
			})
			setComments(commentsData)
		} catch (err) {
			console.error('Error loading comments:', err)
			setError('Failed to load comments')
		} finally {
			setIsLoading(false)
		}
	}, [postId])

	useEffect(() => {
		loadComments()
	}, [loadComments])

	// Handle submitting a new comment
	const handleSubmitComment = async (e: React.FormEvent) => {
		e.preventDefault()

		if (!currentUser) {
			setError('You must be logged in to comment')
			return
		}

		if (!newComment.trim()) {
			return
		}

		try {
			setIsSubmitting(true)
			setError(null)

			const commentData = {
				content: newComment.trim(),
				postId,
				parentId: replyToId || undefined,
			}

			await createComment(commentData, {
				userId: currentUser.id,
				userAgent: navigator.userAgent,
				ipAddress: 'client-side',
			})

			// Reset form and refresh comments
			setNewComment('')
			setReplyToId(null)
			await loadComments()
		} catch (err) {
			console.error('Error posting comment:', err)
			setError('Failed to post comment')
		} finally {
			setIsSubmitting(false)
		}
	}

	// Handle starting a reply
	const handleReply = (commentId: string) => {
		setReplyToId(commentId)

		// Focus the comment textarea
		setTimeout(() => {
			if (commentInputRef.current) {
				commentInputRef.current.focus()
			}
		}, 100)
	}

	// Handle canceling a reply
	const handleCancelReply = () => {
		setReplyToId(null)
	}

	// Handle deleting a comment
	const handleDeleteComment = async (commentId: string) => {
		if (!currentUser) return

		if (!confirm('Are you sure you want to delete this comment?')) {
			return
		}

		try {
			setError(null)

			await deleteComment(commentId, {
				userId: currentUser.id,
				userAgent: navigator.userAgent,
				ipAddress: 'client-side',
			})

			// Refresh comments
			await loadComments()
		} catch (err) {
			console.error('Error deleting comment:', err)
			setError('Failed to delete comment')
		}
	}

	// Render a single comment
	const CommentItem = ({
		comment,
		isReply = false,
	}: {
		comment: any
		isReply?: boolean
	}) => {
		const formattedDate = formatDistanceToNow(new Date(comment.createdAt), {
			addSuffix: true,
		})
		const isAuthor = currentUser?.id === comment.authorId

		const userName = comment.author?.firstName
			? `${comment.author.firstName} ${comment.author.lastName || ''}`
			: 'Anonymous'

		return (
			<div
				className={`${isReply ? 'ml-8 border-l border-button-border pl-4' : ''} mb-4`}
			>
				<div className="flex items-start gap-3">
					<div className="h-8 w-8 rounded-full bg-gradient-to-br from-[#3a6d10] to-[#4e9815]"></div>

					<div className="flex-1">
						<div className="flex items-center gap-2">
							<span className="font-medium text-button-hover">
								{userName}
							</span>
							<span className="text-xs text-button">•</span>
							<time className="text-xs text-button">
								{formattedDate}
							</time>
						</div>

						<div className="mt-1 text-button-hover">
							{comment.content}
						</div>

						<div className="mt-2 flex items-center gap-4">
							<button className="flex items-center gap-1 text-xs text-button hover:text-title-light">
								<Heart className="h-3 w-3" />
								<span>Like</span>
							</button>

							{!isReply && currentUser && (
								<button
									onClick={() => handleReply(comment.id)}
									className="flex items-center gap-1 text-xs text-button hover:text-title-light"
								>
									<Reply className="h-3 w-3" />
									<span>Reply</span>
								</button>
							)}

							{isAuthor && (
								<button
									onClick={() =>
										handleDeleteComment(comment.id)
									}
									className="flex items-center gap-1 text-xs text-red-400 hover:text-red-300"
								>
									<Trash2 className="h-3 w-3" />
									<span>Delete</span>
								</button>
							)}
						</div>
					</div>
				</div>

				{comment.replies && comment.replies.length > 0 && (
					<div className="mt-4 space-y-4">
						{comment.replies.map((reply: any) => (
							<CommentItem
								key={reply.id}
								comment={reply}
								isReply={true}
							/>
						))}
					</div>
				)}
			</div>
		)
	}

	return (
		<div className="mt-8">
			<h2 className="text-xl font-semibold text-title-light mb-4">
				Comments
			</h2>

			{error && (
				<div className="bg-red-900/20 border border-red-900/50 text-red-400 px-4 py-3 rounded-md mb-6">
					{error}
				</div>
			)}

			{currentUser ? (
				<form
					onSubmit={handleSubmitComment}
					className="mb-8"
				>
					<div className="flex gap-3 items-start">
						<div className="h-8 w-8 rounded-full bg-gradient-to-br from-[#3a6d10] to-[#4e9815] flex-shrink-0"></div>
						<div className="flex-1">
							{replyToId && (
								<div className="text-xs text-button-hover mb-1 flex justify-between">
									<span>Replying to a comment</span>
									<button
										type="button"
										onClick={handleCancelReply}
										className="text-button hover:text-title-light"
									>
										Cancel
									</button>
								</div>
							)}

							<textarea
								ref={commentInputRef}
								value={newComment}
								onChange={(e) => setNewComment(e.target.value)}
								placeholder="Write a comment..."
								className="w-full px-4 py-2 rounded-md border border-button-border bg-background text-title-light focus:outline-none focus:ring-1 focus:ring-[#4e9815]/50 resize-none"
								rows={3}
							></textarea>

							<div className="mt-2 flex justify-end">
								<button
									type="submit"
									disabled={
										isSubmitting || !newComment.trim()
									}
									className="px-3 py-1 rounded-md bg-[#4e9815]/10 border border-[#4e9815]/30 text-[#4e9815] hover:bg-[#4e9815]/20 transition-colors disabled:opacity-50"
								>
									{isSubmitting
										? 'Posting...'
										: 'Post Comment'}
								</button>
							</div>
						</div>
					</div>
				</form>
			) : (
				<div className="bg-background-lighter border border-button-border rounded-lg p-4 text-center mb-8">
					<p className="text-button">
						<a
							href="/login"
							className="text-[#4e9815] hover:underline"
						>
							Log in
						</a>{' '}
						to join the discussion
					</p>
				</div>
			)}

			{isLoading ? (
				<div className="text-center py-6 text-button">
					Loading comments...
				</div>
			) : comments.length === 0 ? (
				<div className="text-center py-6 text-button">
					No comments yet. Be the first to comment!
				</div>
			) : (
				<div className="space-y-6">
					{comments.map((comment) => (
						<CommentItem
							key={comment.id}
							comment={comment}
						/>
					))}
				</div>
			)}
		</div>
	)
}
