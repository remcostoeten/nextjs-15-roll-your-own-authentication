'use client'

import type React from 'react'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { updateWorkspace } from '@/modules/workspaces/api/mutations'
import { useToast } from '@/hooks/use-toast'
import { Loader2 } from 'lucide-react'

type TProps = {
	workspace: {
		id: string
		name: string
		description: string | null
		slug: string
	}
}

export function WorkspaceSettingsForm({ workspace }: TProps) {
	const router = useRouter()
	const { toast } = useToast()
	const [name, setName] = useState(workspace.name)
	const [description, setDescription] = useState(workspace.description || '')
	const [isSubmitting, setIsSubmitting] = useState(false)

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setIsSubmitting(true)

		const formData = new FormData()
		formData.append('name', name)
		formData.append('description', description)

		try {
			const result = await updateWorkspace(workspace.id, formData)

			if (result.error) {
				toast({
					variant: 'destructive',
					title: 'Failed to update workspace',
					description: result.error,
				})
			} else {
				toast({
					title: 'Workspace updated',
					description:
						'Your workspace has been updated successfully.',
				})

				// If the slug changed, redirect to the new URL
				if (result.slug && result.slug !== workspace.slug) {
					router.push(`/dashboard/workspaces/${result.slug}/settings`)
				} else {
					router.refresh()
				}
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
			className="space-y-4"
		>
			<div className="space-y-2">
				<Label htmlFor="name">Workspace Name</Label>
				<Input
					id="name"
					value={name}
					onChange={(e) => setName(e.target.value)}
					required
					disabled={isSubmitting}
				/>
			</div>
			<div className="space-y-2">
				<Label htmlFor="description">Description (Optional)</Label>
				<Textarea
					id="description"
					value={description}
					onChange={(e) => setDescription(e.target.value)}
					rows={4}
					disabled={isSubmitting}
				/>
			</div>
			<Button
				type="submit"
				disabled={isSubmitting}
			>
				{isSubmitting ? (
					<>
						<Loader2 className="mr-2 h-4 w-4 animate-spin" />
						Saving...
					</>
				) : (
					'Save Changes'
				)}
			</Button>
		</form>
	)
}
