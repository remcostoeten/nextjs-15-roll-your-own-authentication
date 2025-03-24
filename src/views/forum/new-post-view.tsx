'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { User } from '@/server/db/schemas/users'
import { postSchema, type PostInput } from '@/modules/posts/models/z.post'
import { createPost } from '@/modules/posts/api/mutations'
import { ArrowLeft, CheckSquare, Save } from 'lucide-react'
import Link from 'next/link'

interface NewPostViewProps {
	user: User
}

export function NewPostView({ user }: NewPostViewProps) {
	const router = useRouter()
	const [isSubmitting, setIsSubmitting] = useState(false)
	const [error, setError] = useState<string | null>(null)

	const {
		register,
		handleSubmit,
		formState: { errors },
		watch,
	} = useForm<PostInput>({
		resolver: zodResolver(postSchema),
		defaultValues: {
			title: '',
			content: '',
			published: true,
			sensitive: false,
		},
	})

	const onSubmit = async (data: PostInput) => {
		try {
			setIsSubmitting(true)
			setError(null)

			// Get client info for logging
			const userAgent = navigator.userAgent
			const ipAddress = 'client-side' // Will be determined server-side

			// Submit the post
			const newPost = await createPost(data, {
				userId: user.id,
				userAgent,
				ipAddress,
			})

			// Redirect to post
			router.push(`/forum/post/${newPost.id}`)
		} catch (err) {
			console.error('Error creating post:', err)
			setError('Failed to create post. Please try again.')
		} finally {
			setIsSubmitting(false)
		}
	}

	return (
		<div className="max-w-3xl mx-auto">
			<div className="flex items-center mb-6">
				<Link
					href="/forum"
					className="flex items-center text-button hover:text-title-light mr-4"
				>
					<ArrowLeft className="h-5 w-5 mr-1" />
					<span>Back</span>
				</Link>
				<h1 className="text-2xl font-bold text-title-light">Create New Post</h1>
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
						<span className="ml-3 text-button">Publish immediately</span>
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
						href="/forum"
						className="px-4 py-2 rounded-md border border-button-border text-button hover:text-title-light transition-colors"
					>
						Cancel
					</Link>

					<button
						type="submit"
						disabled={isSubmitting}
						className="flex items-center gap-2 px-4 py-2 rounded-md bg-[#4e9815]/10 border border-[#4e9815]/30 text-[#4e9815] hover:bg-[#4e9815]/20 transition-colors disabled:opacity-50"
					>
						{watch('published') ? (
							<>
								<CheckSquare className="h-4 w-4" />
								<span>Publish Post</span>
							</>
						) : (
							<>
								<Save className="h-4 w-4" />
								<span>Save as Draft</span>
							</>
						)}
					</button>
				</div>
			</form>
		</div>
	)
}
