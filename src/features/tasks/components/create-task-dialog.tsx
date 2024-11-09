'use client'

import { Plus } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import {
	Button,
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger
} from 'ui'
import { createTask } from '../actions/create-task'

export function CreateTaskDialog() {
	const router = useRouter()

	async function onSubmit(formData: FormData) {
		const result = await createTask(formData)

		if (result.error) {
			toast.error(result.error)
			return
		}

		toast.success('Task created')
		router.refresh()
	}

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button size="icon" variant="outline">
					<Plus className="h-4 w-4" />
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Create New Task</DialogTitle>
				</DialogHeader>
				<form action={onSubmit} className="space-y-4">
					<div>
						<label
							htmlFor="title"
							className="block text-sm font-medium mb-1"
						>
							Title
						</label>
						<input
							id="title"
							name="title"
							className="w-full rounded-md border border-input bg-transparent px-3 py-2"
							required
						/>
					</div>
					<div>
						<label
							htmlFor="description"
							className="block text-sm font-medium mb-1"
						>
							Description
						</label>
						<textarea
							id="description"
							name="description"
							className="w-full rounded-md border border-input bg-transparent px-3 py-2 min-h-[100px]"
						/>
					</div>
					<div>
						<label
							htmlFor="priority"
							className="block text-sm font-medium mb-1"
						>
							Priority
						</label>
						<select
							id="priority"
							name="priority"
							className="w-full rounded-md border border-input bg-transparent px-3 py-2"
						>
							<option value="low">Low</option>
							<option value="medium">Medium</option>
							<option value="high">High</option>
						</select>
					</div>
					<div>
						<label
							htmlFor="dueDate"
							className="block text-sm font-medium mb-1"
						>
							Due Date
						</label>
						<input
							type="date"
							id="dueDate"
							name="dueDate"
							className="w-full rounded-md border border-input bg-transparent px-3 py-2"
						/>
					</div>
					<Button type="submit" className="w-full">
						Create Task
					</Button>
				</form>
			</DialogContent>
		</Dialog>
	)
}
