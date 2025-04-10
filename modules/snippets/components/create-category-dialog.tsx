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
import { createCategory } from '@/modules/snippets/api/mutations'

interface CreateCategoryDialogProps {
	workspaceId: string
}

export function CreateCategoryDialog({
	workspaceId,
}: CreateCategoryDialogProps) {
	const router = useRouter()
	const { toast } = useToast()
	const [open, setOpen] = useState(false)
	const [isSubmitting, setIsSubmitting] = useState(false)
	const [name, setName] = useState('')

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setIsSubmitting(true)

		try {
			const formData = new FormData()
			formData.append('name', name)

			const result = await createCategory(workspaceId, formData)

			if (result.error) {
				toast({
					title: 'Error',
					description: result.error,
					variant: 'destructive',
				})
			} else {
				toast({
					title: 'Success',
					description: 'Category created successfully',
				})

				setOpen(false)
				setName('')
				router.refresh()
			}
		} catch (error) {
			toast({
				title: 'Error',
				description: 'Failed to create category',
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
					<span className="sr-only">Add category</span>
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[400px]">
				<DialogHeader>
					<DialogTitle>Create new category</DialogTitle>
					<DialogDescription>
						Add a new category to organize your snippets
					</DialogDescription>
				</DialogHeader>

				<form onSubmit={handleSubmit}>
					<div className="grid gap-4 py-4">
						<div className="grid gap-2">
							<Label htmlFor="name">Category Name</Label>
							<Input
								id="name"
								value={name}
								onChange={(e) => setName(e.target.value)}
								placeholder="JavaScript"
								required
							/>
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
							{isSubmitting ? 'Creating...' : 'Create Category'}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	)
}
