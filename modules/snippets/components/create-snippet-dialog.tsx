'use client'

import type React from 'react'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Check, ChevronsUpDown, X } from 'lucide-react'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from '@/components/ui/command'
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'
import { createSnippet } from '@/modules/snippets/api/mutations'
import {
	getWorkspaceCategories,
	getWorkspaceLabels,
} from '@/modules/snippets/api/queries'

interface CreateSnippetDialogProps {
	workspaceId: string
	workspaceSlug: string
	open: boolean
	onOpenChange: (open: boolean) => void
}

export function CreateSnippetDialog({
	workspaceId,
	workspaceSlug,
	open,
	onOpenChange,
}: CreateSnippetDialogProps) {
	const router = useRouter()
	const { toast } = useToast()
	const [isSubmitting, setIsSubmitting] = useState(false)
	const [categories, setCategories] = useState<
		{ id: string; name: string }[]
	>([])
	const [labels, setLabels] = useState<
		{ id: string; name: string; color: string }[]
	>([])
	const [selectedCategory, setSelectedCategory] = useState<string | null>(
		null
	)
	const [selectedLabels, setSelectedLabels] = useState<string[]>([])
	const [isPublic, setIsPublic] = useState(false)
	const [title, setTitle] = useState('')
	const [content, setContent] = useState('')
	const [language, setLanguage] = useState('plain')

	// Fetch categories and labels
	useEffect(() => {
		const fetchData = async () => {
			try {
				const categoriesData = await getWorkspaceCategories(workspaceId)
				const labelsData = await getWorkspaceLabels(workspaceId)

				setCategories(categoriesData)
				setLabels(labelsData)
			} catch (error) {
				console.error('Error fetching data:', error)
			}
		}

		if (open) {
			fetchData()
		}
	}, [workspaceId, open])

	// Reset form when dialog closes
	useEffect(() => {
		if (!open) {
			setTitle('')
			setContent('')
			setLanguage('plain')
			setSelectedCategory(null)
			setSelectedLabels([])
			setIsPublic(false)
		}
	}, [open])

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setIsSubmitting(true)

		try {
			const formData = new FormData()
			formData.append('title', title)
			formData.append('content', content)
			formData.append('language', language)
			formData.append('isPublic', String(isPublic))

			if (selectedCategory) {
				formData.append('categoryId', selectedCategory)
			}

			if (selectedLabels.length > 0) {
				formData.append('labelIds', JSON.stringify(selectedLabels))
			}

			const result = await createSnippet(workspaceId, formData)

			if (result.error) {
				toast({
					title: 'Error',
					description: result.error,
					variant: 'destructive',
				})
			} else {
				toast({
					title: 'Success',
					description: 'Snippet created successfully',
				})

				onOpenChange(false)
				router.refresh()
			}
		} catch (error) {
			toast({
				title: 'Error',
				description: 'Failed to create snippet',
				variant: 'destructive',
			})
		} finally {
			setIsSubmitting(false)
		}
	}

	// Get label by ID
	const getLabelById = (id: string) => {
		return labels.find((label) => label.id === id)
	}

	return (
		<Dialog
			open={open}
			onOpenChange={onOpenChange}
		>
			<DialogContent className="sm:max-w-[600px]">
				<DialogHeader>
					<DialogTitle>Create new snippet</DialogTitle>
					<DialogDescription>
						Add a new code snippet to your collection
					</DialogDescription>
				</DialogHeader>

				<form onSubmit={handleSubmit}>
					<div className="grid gap-4 py-4">
						<div className="grid gap-2">
							<Label htmlFor="title">Title</Label>
							<Input
								id="title"
								value={title}
								onChange={(e) => setTitle(e.target.value)}
								placeholder="My awesome snippet"
								required
							/>
						</div>

						<div className="grid gap-2">
							<Label htmlFor="content">Content</Label>
							<Textarea
								id="content"
								value={content}
								onChange={(e) => setContent(e.target.value)}
								placeholder="console.log('Hello world');"
								className="min-h-[200px] font-mono"
								required
							/>
						</div>

						<div className="grid gap-2">
							<Label htmlFor="language">Language</Label>
							<Input
								id="language"
								value={language}
								onChange={(e) => setLanguage(e.target.value)}
								placeholder="javascript, python, etc."
							/>
						</div>

						<div className="grid gap-2">
							<Label htmlFor="category">Category</Label>
							<Popover>
								<PopoverTrigger asChild>
									<Button
										variant="outline"
										role="combobox"
										className="justify-between"
									>
										{selectedCategory
											? categories.find(
													(category) =>
														category.id ===
														selectedCategory
												)?.name
											: 'Select category'}
										<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
									</Button>
								</PopoverTrigger>
								<PopoverContent className="w-[200px] p-0">
									<Command>
										<CommandInput placeholder="Search category..." />
										<CommandList>
											<CommandEmpty>
												No category found.
											</CommandEmpty>
											<CommandGroup>
												{categories.map((category) => (
													<CommandItem
														key={category.id}
														value={category.name}
														onSelect={() => {
															setSelectedCategory(
																selectedCategory ===
																	category.id
																	? null
																	: category.id
															)
														}}
													>
														<Check
															className={`mr-2 h-4 w-4 ${
																selectedCategory ===
																category.id
																	? 'opacity-100'
																	: 'opacity-0'
															}`}
														/>
														{category.name}
													</CommandItem>
												))}
											</CommandGroup>
										</CommandList>
									</Command>
								</PopoverContent>
							</Popover>
						</div>

						<div className="grid gap-2">
							<Label>Labels</Label>
							<Popover>
								<PopoverTrigger asChild>
									<Button
										variant="outline"
										role="combobox"
										className="justify-between"
									>
										{selectedLabels.length > 0
											? `${selectedLabels.length} label${selectedLabels.length > 1 ? 's' : ''} selected`
											: 'Select labels'}
										<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
									</Button>
								</PopoverTrigger>
								<PopoverContent className="w-[200px] p-0">
									<Command>
										<CommandInput placeholder="Search labels..." />
										<CommandList>
											<CommandEmpty>
												No label found.
											</CommandEmpty>
											<CommandGroup>
												{labels.map((label) => (
													<CommandItem
														key={label.id}
														value={label.name}
														onSelect={() => {
															setSelectedLabels(
																selectedLabels.includes(
																	label.id
																)
																	? selectedLabels.filter(
																			(
																				id
																			) =>
																				id !==
																				label.id
																		)
																	: [
																			...selectedLabels,
																			label.id,
																		]
															)
														}}
													>
														<Check
															className={`mr-2 h-4 w-4 ${
																selectedLabels.includes(
																	label.id
																)
																	? 'opacity-100'
																	: 'opacity-0'
															}`}
														/>
														<span
															className="h-2 w-2 rounded-full mr-2"
															style={{
																backgroundColor:
																	label.color,
															}}
														/>
														{label.name}
													</CommandItem>
												))}
											</CommandGroup>
										</CommandList>
									</Command>
								</PopoverContent>
							</Popover>

							{selectedLabels.length > 0 && (
								<div className="flex flex-wrap gap-2 mt-2">
									{selectedLabels.map((labelId) => {
										const label = getLabelById(labelId)
										if (!label) return null

										return (
											<Badge
												key={labelId}
												style={{
													backgroundColor: `${label.color}20`,
													color: label.color,
													borderColor: `${label.color}40`,
												}}
												variant="outline"
												className="flex items-center gap-1"
											>
												{label.name}
												<X
													className="h-3 w-3 cursor-pointer"
													onClick={() =>
														setSelectedLabels(
															selectedLabels.filter(
																(id) =>
																	id !==
																	labelId
															)
														)
													}
												/>
											</Badge>
										)
									})}
								</div>
							)}
						</div>

						<div className="flex items-center space-x-2">
							<Switch
								id="public"
								checked={isPublic}
								onCheckedChange={setIsPublic}
							/>
							<Label htmlFor="public">
								Make this snippet public
							</Label>
						</div>
					</div>

					<DialogFooter>
						<Button
							type="button"
							variant="outline"
							onClick={() => onOpenChange(false)}
							disabled={isSubmitting}
						>
							Cancel
						</Button>
						<Button
							type="submit"
							disabled={isSubmitting}
						>
							{isSubmitting ? 'Creating...' : 'Create Snippet'}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	)
}
