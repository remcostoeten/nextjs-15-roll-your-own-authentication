'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { User } from '@/server/db/schemas/users'
import { postSchema, type PostInput, type Post } from '@/modules/posts/models/z.post'
import { updatePost } from '@/modules/posts/api/mutations'
import { ArrowLeft, Save } from 'lucide-react'
import Link from 'next/link'

interface EditPostViewProps {
	post: Post
	user: User
}

export function EditPostView({ post, user }: EditPostViewProps) {
	const router = useRouter()
	const [isSubmitting, setIsSubmitting] = useState(false)
	const [error, setError] = useState<string | null>(null)

	const {
		register,
		handleSubmit,
		formState: { errors, isDirty },
	} = useForm<PostInput>({
		resolver: zodResolver(postSchema),
		defaultValues: {
			title: post.title,
			content: post.content,
			published: post.published,
			sensitive: post.sensitive,
		},
	})

	const onSubmit = async (data: PostInput) => {
		// Prevent submission if nothing has changed
		if (!isDirty) {
			router.push(`/forum/post/${post.id}`)
			return
		}

		try {
			setIsSubmitting(true)
			setError(null)

			// Get client info for logging
			const userAgent = navigator.userAgent
			const ipAddress = 'client-side' // Will be determined server-side

			// Submit the post
			const updatedPost = await updatePost(post.id, data, {
				userId: user.id,
				userAgent,
				ipAddress,
			})

			// Redirect to post
			router.push(`/forum/post/${updatedPost.id}`)
		} catch (err) {
			console.error('Error updating post:', err)
			setError('Failed to update post. Please try again.')
		} finally {
			setIsSubmitting(false)
		}
	}

	return (
		<div className="max-w-3xl mx-auto">
			<div className="flex items-center mb-6">
				<Link
					href={`/forum/post/${post.id}`}
					className="flex items-center text-button hover:text-title-light mr-4"
				>
					<ArrowLeft className="h-5 w-5 mr-1" />
					<span>Back</span>
				</Link>
				<h1 className="text-2xl font-bold text-title-light">Edit Post</h1>
			</div>

			{error && (
				<div className="bg-red-900/20 border border-red-900/50 text-red-400 px-4 py-3 rounded-md mb-6">
					{error}
				</div>
			)}

			<form
				onSubmit={handleSubmit(onSubmit)}
				className="space-y-6"
			>
				<div className="space-y-2">
					<label
						htmlFor="title"
						className="block text-title-light"
					>
						Title <span className="text-red-500">*</span>
					</label>
					<input
						id="title"
						type="text"
						{...register('title')}
						className="w-full px-4 py-2 rounded-md border border-button-border bg-background text-title-light focus:outline-none focus:ring-2 focus:ring-[#4e9815]/50"
						placeholder="Enter a descriptive title"
					/>
					{errors.title && <p className="text-red-400 text-sm">{errors.title.message}</p>}
				</div>

				<div className="space-y-2">
					<label
						htmlFor="content"
						className="block text-title-light"
					>
						Content <span className="text-red-500">*</span>
					</label>
					<textarea
						id="content"
						{...register('content')}
						rows={12}
						className="w-full px-4 py-2 rounded-md border border-button-border bg-background text-title-light focus:outline-none focus:ring-2 focus:ring-[#4e9815]/50"
						placeholder="Share your thoughts..."
					></textarea>
					{errors.content && <p className="text-red-400 text-sm">{errors.content.message}</p>}
				</div>

				<div className="flex items-center space-x-6">
					<label className="inline-flex items-center cursor-pointer">
						<input
							type="checkbox"
							{...register('published')}
							className="sr-only peer"
						/>
						<div className="relative w-11 h-6 bg-background-lighter rounded-full peer peer-checked:bg-[#4e9815]/20 peer-focus:ring-2 peer-focus:ring-[#4e9815]/50">
							<div className="absolute left-1 top-1 bg-button w-4 h-4 rounded-full transition-all peer-checked:bg-[#4e9815] peer-checked:left-6"></div>
						</div>
						<span className="ml-3 text-button">Published</span>
					</label>

					<label className="inline-flex items-center cursor-pointer">
						<input
							type="checkbox"
							{...register('sensitive')}
							className="sr-only peer"
						/>
						<div className="relative w-11 h-6 bg-background-lighter rounded-full peer peer-checked:bg-[#4e9815]/20 peer-focus:ring-2 peer-focus:ring-[#4e9815]/50">
							<div className="absolute left-1 top-1 bg-button w-4 h-4 rounded-full transition-all peer-checked:bg-[#4e9815] peer-checked:left-6"></div>
						</div>
						<span className="ml-3 text-button">Sensitive content</span>
					</label>
				</div>

				<div className="flex items-center justify-end space-x-4 pt-4">
					<Link
						href={`/forum/post/${post.id}`}
						className="px-4 py-2 rounded-md border border-button-border text-button hover:text-title-light transition-colors"
					>
						Cancel
					</Link>

					<button
						type="submit"
						disabled={isSubmitting || !isDirty}
						className="flex items-center gap-2 px-4 py-2 rounded-md bg-[#4e9815]/10 border border-[#4e9815]/30 text-[#4e9815] hover:bg-[#4e9815]/20 transition-colors disabled:opacity-50"
					>
						<Save className="h-4 w-4" />
						<span>Save Changes</span>
					</button>
				</div>
			</form>
		</div>
	)
}
