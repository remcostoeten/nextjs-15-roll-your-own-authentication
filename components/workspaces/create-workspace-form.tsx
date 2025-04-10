'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { createWorkspace } from '@/modules/workspaces/api/mutations'

export function CreateWorkspaceForm() {
	const router = useRouter()
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)

	async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault()
		setIsLoading(true)
		setError(null)

		const formData = new FormData(event.currentTarget)
		const result = await createWorkspace(formData)

		if (result.error) {
			setError(result.error)
			setIsLoading(false)
			return
		}

		router.push(`/dashboard/workspaces/${result.slug}`)
	}

	return (
		<form
			onSubmit={onSubmit}
			className="space-y-4"
		>
			<div className="space-y-2">
				<label
					htmlFor="name"
					className="text-sm font-medium"
				>
					Name
				</label>
				<Input
					id="name"
					name="name"
					placeholder="Enter workspace name"
					required
					disabled={isLoading}
				/>
			</div>

			<div className="space-y-2">
				<label
					htmlFor="description"
					className="text-sm font-medium"
				>
					Description
				</label>
				<Textarea
					id="description"
					name="description"
					placeholder="Enter workspace description"
					disabled={isLoading}
				/>
			</div>

			{error && <p className="text-sm text-destructive">{error}</p>}

			<Button
				type="submit"
				disabled={isLoading}
			>
				{isLoading ? 'Creating...' : 'Create Workspace'}
			</Button>
		</form>
	)
}
