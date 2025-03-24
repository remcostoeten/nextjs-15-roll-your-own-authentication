'use client'

import { useFormState, useFormStatus } from 'react-dom'
import { createTodoMutation } from '../api/mutations/create-todo'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Textarea } from '@/shared/components/ui/textarea'
import { Label } from '@/shared/components/ui/label'
import { Loader2 } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select'

function SubmitButton() {
	const { pending } = useFormStatus()

	return (
		<Button
			type="submit"
			disabled={pending}
		>
			{pending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
			Add Todo
		</Button>
	)
}

export function CreateTodoForm() {
	const [state, formAction] = useFormState(createTodoMutation, {
		success: false,
		message: null,
	})

	return (
		<form
			action={formAction}
			className="space-y-4"
		>
			<div className="space-y-2">
				<Label htmlFor="title">Title</Label>
				<Input
					id="title"
					name="title"
					placeholder="What needs to be done?"
					required
				/>
			</div>

			<div className="space-y-2">
				<Label htmlFor="content">Description (optional)</Label>
				<Textarea
					id="content"
					name="content"
					placeholder="Add more details..."
					rows={3}
				/>
			</div>

			<div className="space-y-2">
				<Label htmlFor="tags">Tags (comma separated)</Label>
				<Input
					id="tags"
					name="tags"
					placeholder="e.g. work, personal, urgent"
				/>
			</div>

			<div className="space-y-2">
				<Label htmlFor="priority">Priority</Label>
				<Select
					name="priority"
					defaultValue="0"
				>
					<SelectTrigger>
						<SelectValue placeholder="Select priority" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="0">None</SelectItem>
						<SelectItem value="1">Low</SelectItem>
						<SelectItem value="2">Medium</SelectItem>
						<SelectItem value="3">High</SelectItem>
					</SelectContent>
				</Select>
			</div>

			{state.message && !state.success && <p className="text-sm text-destructive">{state.message}</p>}

			<div className="flex justify-end">
				<SubmitButton />
			</div>
		</form>
	)
}
