'use client'

import { Button } from '@/shared/components/ui'
import { Input } from '@/shared/components/ui/input'
import { Label } from '@/shared/components/ui/label'
import { Textarea } from '@/shared/components/ui/textarea'
import { useRouter } from 'next/navigation'
import { useFormState } from 'react-dom'
import { createWorkspace } from '../actions/create-workspace'

type WorkspaceFormState = {
	error?: {
		name?: string[]
		description?: string[]
		emoji?: string[]
		_form?: string[]
	}
}

const initialState: WorkspaceFormState = {}

export default function WorkspaceCreationForm() {
	const router = useRouter()
	const [state, formAction] = useFormState(createWorkspace, initialState)

	return (
		<div className="fixed inset-0 bg-background/80 backdrop-blur-sm">
			<div className="container flex items-center justify-center min-h-screen">
				<div className="w-full max-w-lg space-y-6 bg-card p-8 rounded-lg border">
					<div>
						<h2 className="text-2xl font-bold">
							Create Your Workspace
						</h2>
						<p className="text-muted-foreground">
							Set up a new workspace to organize your work
						</p>
					</div>

					<form action={formAction} className="space-y-4">
						<div className="space-y-2">
							<Label htmlFor="emoji">Workspace Icon</Label>
							<Input
								id="emoji"
								name="emoji"
								placeholder="Choose an emoji 😊"
								maxLength={2}
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="name">Workspace Name</Label>
							<Input
								id="name"
								name="name"
								placeholder="My Awesome Workspace"
								required
							/>
							{state.error?.name && (
								<p className="text-sm text-red-500">
									{state.error.name[0]}
								</p>
							)}
						</div>

						<div className="space-y-2">
							<Label htmlFor="description">Description</Label>
							<Textarea
								id="description"
								name="description"
								placeholder="What's this workspace for?"
								rows={3}
							/>
						</div>

						{state.error?._form && (
							<p className="text-sm text-red-500">
								{state.error._form[0]}
							</p>
						)}

						<Button type="submit" className="w-full">
							Create Workspace
						</Button>
					</form>
				</div>
			</div>
		</div>
	)
}
