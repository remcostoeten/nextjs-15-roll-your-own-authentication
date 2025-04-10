'use client'

import type React from 'react'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus } from 'lucide-react'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import { createLabel } from '@/modules/snippets/api/mutations'

interface CreateLabelDialogProps {
	workspaceId: string
}

export function CreateLabelDialog({ workspaceId }: CreateLabelDialogProps) {
	const router = useRouter()
	const { toast } = useToast()
	const [open, setOpen] = useState(false)
	const [isSubmitting, setIsSubmitting] = useState(false)
	const [name, setName] = useState('')
	const [color, setColor] = useState('#6366F1')

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setIsSubmitting(true)

		try {
			const formData = new FormData()
			formData.append('name', name)
			formData.append('color', color)

			const result = await createLabel(workspaceId, formData)

			if (result.error) {
				toast({
					title: 'Error',
					description: result.error,
					variant: 'destructive',
				})
			} else {
				toast({
					title: 'Success',
					description: 'Label created successfully',
				})

				setOpen(false)
				setName('')
				setColor('#6366F1')
				router.refresh()
			}
		} catch (error) {
			toast({
				title: 'Error',
				description: 'Failed to create label',
				variant: 'destructive',
			})
		} finally {
			setIsSubmitting(false)
		}
	}

	return (
		<Dialog
			open={open}
			onOpenChange={setOpen}
		>
			<DialogTrigger asChild>
				<Button
					variant="ghost"
					size="icon"
					className="h-5 w-5"
				>
					<Plus className="h-4 w-4" />
					<span className="sr-only">Add label</span>
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[400px]">
				<DialogHeader>
					<DialogTitle>Create new label</DialogTitle>
					<DialogDescription>
						Add a new label to categorize your snippets
					</DialogDescription>
				</DialogHeader>

				<form onSubmit={handleSubmit}>
					<div className="grid gap-4 py-4">
						<div className="grid gap-2">
							<Label htmlFor="name">Label Name</Label>
							<Input
								id="name"
								value={name}
								onChange={(e) => setName(e.target.value)}
								placeholder="Important"
								required
							/>
						</div>

						<div className="grid gap-2">
							<Label htmlFor="color">Color</Label>
							<div className="flex items-center gap-2">
								<div
									className="h-8 w-8 rounded-md border"
									style={{ backgroundColor: color }}
								/>
								<Input
									id="color"
									type="color"
									value={color}
									onChange={(e) => setColor(e.target.value)}
									required
								/>
							</div>
						</div>
					</div>

					<DialogFooter>
						<Button
							type="button"
							variant="outline"
							onClick={() => setOpen(false)}
							disabled={isSubmitting}
						>
							Cancel
						</Button>
						<Button
							type="submit"
							disabled={isSubmitting}
						>
							{isSubmitting ? 'Creating...' : 'Create Label'}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	)
}
