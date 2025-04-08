'use client'

import type React from 'react'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { createWorkspaceActivity } from '@/modules/workspaces/api/mutations'
import { useToast } from '@/hooks/use-toast'
import { Loader2 } from 'lucide-react'

type TProps = {
	workspaceId: `workspace_${string}`
}

export function WorkspaceMessageForm({ workspaceId }: TProps) {
	const router = useRouter()
	const { toast } = useToast()
	const [message, setMessage] = useState('')
	const [isSubmitting, setIsSubmitting] = useState(false)

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()

		if (!message.trim()) return

		setIsSubmitting(true)

		const formData = new FormData()
		formData.append('type', 'message')
		formData.append('content', message)

		try {
			const result = await createWorkspaceActivity(workspaceId, formData)

			if (result.error) {
				toast({
					variant: 'destructive',
					title: 'Failed to post message',
					description: result.error,
				})
			} else {
				setMessage('')
				router.refresh()
			}
		} catch (error) {
			toast({
				variant: 'destructive',
				title: 'Something went wrong',
				description: 'Please try again later.',
			})
		} finally {
			setIsSubmitting(false)
		}
	}

	return (
		<form
			onSubmit={handleSubmit}
			className="space-y-2"
		>
			<Textarea
				placeholder="Share an update with your team..."
				value={message}
				onChange={(e) => setMessage(e.target.value)}
				className="min-h-[80px]"
				disabled={isSubmitting}
			/>
			<div className="flex justify-end">
				<Button
					type="submit"
					disabled={isSubmitting || !message.trim()}
				>
					{isSubmitting ? (
						<>
							<Loader2 className="mr-2 h-4 w-4 animate-spin" />
							Posting...
						</>
					) : (
						'Post Message'
					)}
				</Button>
			</div>
		</form>
	)
}
