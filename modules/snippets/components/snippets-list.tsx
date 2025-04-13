'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { getWorkspaceSnippets } from '@/modules/snippets/api/queries'
import {
	bulkOperateSnippets,
	exportSnippets,
} from '@/modules/snippets/api/mutations'
import { SnippetCard } from './snippet-card'
import { Pagination } from '@/components/ui/pagination'
import { EmptyState } from './empty-state'
import { Button } from '@/components/ui/button'
import Checkbox from '@/shared/components/core/checkbox/Checkbox'
import { useToast } from '@/hooks/use-toast'
import {
	FolderArchiveIcon as ArchiveBox,
	Download,
	MoreHorizontal,
	Pin,
	Star,
	Tag,
	Trash2,
} from 'lucide-react'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
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
import { Check } from 'lucide-react'
import { getWorkspaceLabels } from '../api/queries'

interface SnippetsListProps {
	workspaceId: string
	searchQuery?: string
	categoryId?: string | null
	labelIds?: string[]
	isPublicOnly?: boolean
	isPinned?: boolean
	isFavorite?: boolean
	isArchived?: boolean
	page?: number
	sortBy?: 'title' | 'createdAt' | 'updatedAt' | 'position'
	sortOrder?: 'asc' | 'desc'
}

export function SnippetsList({
	workspaceId,
	searchQuery = '',
	categoryId = null,
	labelIds = [],
	isPublicOnly = false,
	isPinned = false,
	isFavorite = false,
	isArchived = false,
	page = 1,
	sortBy = 'position',
	sortOrder = 'desc',
}: SnippetsListProps) {
	const router = useRouter()
	const { toast } = useToast()
	const [selectedSnippets, setSelectedSnippets] = useState<string[]>([])
	const [isAllSelected, setIsAllSelected] = useState(false)
	const [isLoading, setIsLoading] = useState(false)
	const [isExporting, setIsExporting] = useState(false)
	const [showLabelDialog, setShowLabelDialog] = useState(false)
	const [labels, setLabels] = useState<
		{ id: string; name: string; color: string }[]
	>([])
	const [selectedLabel, setSelectedLabel] = useState<string | null>(null)
	const [snippets, setSnippets] = useState<any[]>([])
	const [total, setTotal] = useState(0)

	// Fetch snippets
	const fetchSnippets = async () => {
		try {
			const result = await getWorkspaceSnippets({
				workspaceId,
				categoryId,
				labelIds,
				searchQuery,
				isPublicOnly,
				isPinned,
				isFavorite,
				isArchived,
				page,
				limit: 10,
				sortBy,
				sortOrder,
			})

			setSnippets(result.snippets)
			setTotal(result.total)

			// Reset selection when snippets change
			setSelectedSnippets([])
			setIsAllSelected(false)
		} catch (error) {
			console.error('Error fetching snippets:', error)
			toast({
				title: 'Error',
				description: 'Failed to load snippets',
				variant: 'destructive',
			})
		}
	}

	// Fetch labels for the label dialog
	const fetchLabels = async () => {
		try {
			const labelsData = await getWorkspaceLabels(workspaceId)
			setLabels(labelsData)
		} catch (error) {
			console.error('Error fetching labels:', error)
		}
	}

	// Initialize data
	useState(() => {
		fetchSnippets()
	})

	// Calculate pagination
	const totalPages = Math.ceil(total / 10)

	// Handle selection change for a single snippet
	const handleSelectSnippet = (id: string, selected: boolean) => {
		if (selected) {
			setSelectedSnippets((prev) => [...prev, id])
		} else {
			setSelectedSnippets((prev) =>
				prev.filter((snippetId) => snippetId !== id)
			)
		}
	}

	// Handle select all
	const handleSelectAll = (selected: boolean) => {
		setIsAllSelected(selected)
		if (selected) {
			setSelectedSnippets(snippets.map((snippet) => snippet.id))
		} else {
			setSelectedSnippets([])
		}
	}

	// Handle bulk operations
	const handleBulkOperation = async (operation: string) => {
		if (selectedSnippets.length === 0) {
			toast({
				title: 'No snippets selected',
				description: 'Please select at least one snippet',
				variant: 'destructive',
			})
			return
		}

		setIsLoading(true)

		try {
			const formData = new FormData()
			formData.append('snippetIds', JSON.stringify(selectedSnippets))
			formData.append('operation', operation)

			if (
				(operation === 'addLabel' || operation === 'removeLabel') &&
				!selectedLabel
			) {
				setShowLabelDialog(true)
				setIsLoading(false)
				return
			}

			if (
				(operation === 'addLabel' || operation === 'removeLabel') &&
				selectedLabel
			) {
				formData.append('labelId', selectedLabel)
			}

			const result = await bulkOperateSnippets(workspaceId, formData)

			if (result.error) {
				toast({
					title: 'Error',
					description: result.error,
					variant: 'destructive',
				})
			} else {
				let actionText = ''
				switch (operation) {
					case 'archive':
						actionText = 'archived'
						break
					case 'unarchive':
						actionText = 'unarchived'
						break
					case 'delete':
						actionText = 'deleted'
						break
					case 'favorite':
						actionText = 'added to favorites'
						break
					case 'unfavorite':
						actionText = 'removed from favorites'
						break
					case 'pin':
						actionText = 'pinned'
						break
					case 'unpin':
						actionText = 'unpinned'
						break
					case 'addLabel':
						actionText = 'labeled'
						break
					case 'removeLabel':
						actionText = 'unlabeled'
						break
				}

				toast({
					title: 'Success',
					description: `${selectedSnippets.length} snippets ${actionText} successfully`,
				})

				// Reset selection and refresh
				setSelectedSnippets([])
				setIsAllSelected(false)
				router.refresh()
			}
		} catch (error) {
			toast({
				title: 'Error',
				description: 'Failed to perform operation',
				variant: 'destructive',
			})
		} finally {
			setIsLoading(false)
			setShowLabelDialog(false)
			setSelectedLabel(null)
		}
	}

	// Handle export
	const handleExport = async (format: string) => {
		if (selectedSnippets.length === 0) {
			toast({
				title: 'No snippets selected',
				description: 'Please select at least one snippet',
				variant: 'destructive',
			})
			return
		}

		setIsExporting(true)

		try {
			const formData = new FormData()
			formData.append('snippetIds', JSON.stringify(selectedSnippets))
			formData.append('format', format)

			const result = await exportSnippets(workspaceId, formData)

			if (result.error) {
				toast({
					title: 'Error',
					description: result.error,
					variant: 'destructive',
				})
			} else {
				// Create a downloadable file
				const dataStr = JSON.stringify(result.data, null, 2)
				const dataBlob = new Blob([dataStr], {
					type: 'application/json',
				})
				const url = URL.createObjectURL(dataBlob)
				const link = document.createElement('a')
				link.href = url
				link.download = `snippets-export-${new Date().toISOString().slice(0, 10)}.json`
				document.body.appendChild(link)
				link.click()
				document.body.removeChild(link)

				toast({
					title: 'Export successful',
					description: `${selectedSnippets.length} snippets exported successfully`,
				})
			}
		} catch (error) {
			toast({
				title: 'Error',
				description: 'Failed to export snippets',
				variant: 'destructive',
			})
		} finally {
			setIsExporting(false)
		}
	}

	// Open label dialog
	const handleOpenLabelDialog = (operation: 'addLabel' | 'removeLabel') => {
		if (selectedSnippets.length === 0) {
			toast({
				title: 'No snippets selected',
				description: 'Please select at least one snippet',
				variant: 'destructive',
			})
			return
		}

		fetchLabels()
		setShowLabelDialog(true)
	}

	if (snippets.length === 0) {
		return (
			<EmptyState
				title="No snippets found"
				description={
					searchQuery ||
					categoryId ||
					labelIds.length > 0 ||
					isPublicOnly ||
					isPinned ||
					isFavorite ||
					isArchived
						? 'Try adjusting your filters or search query'
						: 'Create your first snippet to get started'
				}
				hasFilters={
					!!(
						searchQuery ||
						categoryId ||
						labelIds.length > 0 ||
						isPublicOnly ||
						isPinned ||
						isFavorite ||
						isArchived
					)
				}
			/>
		)
	}

	return (
		<div className="space-y-6">
			{selectedSnippets.length > 0 && (
				<div className="bg-muted p-2 rounded-md flex items-center justify-between">
					<div className="flex items-center gap-2">
						<Checkbox
							checked={isAllSelected}
							onCheckedChange={handleSelectAll}
							id="select-all"
						/>
						<Label
							htmlFor="select-all"
							className="text-sm"
						>
							{selectedSnippets.length} selected
						</Label>
					</div>
					<div className="flex items-center gap-2">
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button
									variant="outline"
									size="sm"
									disabled={isLoading}
								>
									<Tag className="mr-2 h-4 w-4" />
									Labels
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent>
								<DropdownMenuItem
									onClick={() =>
										handleOpenLabelDialog('addLabel')
									}
								>
									Add label
								</DropdownMenuItem>
								<DropdownMenuItem
									onClick={() =>
										handleOpenLabelDialog('removeLabel')
									}
								>
									Remove label
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>

						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button
									variant="outline"
									size="sm"
									disabled={isLoading || isExporting}
								>
									<Download className="mr-2 h-4 w-4" />
									Export
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent>
								<DropdownMenuItem
									onClick={() => handleExport('json')}
								>
									Export as JSON
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>

						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button
									variant="outline"
									size="sm"
									disabled={isLoading}
								>
									<MoreHorizontal className="mr-2 h-4 w-4" />
									Actions
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent>
								<DropdownMenuItem
									onClick={() => handleBulkOperation('pin')}
								>
									<Pin className="mr-2 h-4 w-4" />
									Pin
								</DropdownMenuItem>
								<DropdownMenuItem
									onClick={() => handleBulkOperation('unpin')}
								>
									<Pin className="mr-2 h-4 w-4" />
									Unpin
								</DropdownMenuItem>
								<DropdownMenuItem
									onClick={() =>
										handleBulkOperation('favorite')
									}
								>
									<Star className="mr-2 h-4 w-4" />
									Add to favorites
								</DropdownMenuItem>
								<DropdownMenuItem
									onClick={() =>
										handleBulkOperation('unfavorite')
									}
								>
									<Star className="mr-2 h-4 w-4" />
									Remove from favorites
								</DropdownMenuItem>
								<DropdownMenuSeparator />
								<DropdownMenuItem
									onClick={() =>
										handleBulkOperation(
											isArchived ? 'unarchive' : 'archive'
										)
									}
								>
									<ArchiveBox className="mr-2 h-4 w-4" />
									{isArchived
										? 'Restore from archive'
										: 'Move to archive'}
								</DropdownMenuItem>
								<DropdownMenuSeparator />
								<DropdownMenuItem
									onClick={() =>
										handleBulkOperation('delete')
									}
									className="text-red-600"
								>
									<Trash2 className="mr-2 h-4 w-4" />
									Delete
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
				</div>
			)}

			<div className="grid grid-cols-1 gap-4">
				{snippets.map((snippet) => (
					<SnippetCard
						key={snippet.id}
						snippet={snippet}
						selectable={true}
						selected={selectedSnippets.includes(snippet.id)}
						onSelectChange={handleSelectSnippet}
					/>
				))}
			</div>

			{totalPages > 1 && (
				<Pagination
					currentPage={page}
					totalPages={totalPages}
					baseUrl={`?page=`}
				/>
			)}

			{/* Label Selection Dialog */}
			<Dialog
				open={showLabelDialog}
				onOpenChange={setShowLabelDialog}
			>
				<DialogContent className="sm:max-w-[425px]">
					<DialogHeader>
						<DialogTitle>Select Label</DialogTitle>
						<DialogDescription>
							Choose a label to apply to the selected snippets.
						</DialogDescription>
					</DialogHeader>

					<div className="py-4">
						<Popover>
							<PopoverTrigger asChild>
								<Button
									variant="outline"
									role="combobox"
									className="w-full justify-between"
								>
									{selectedLabel
										? labels.find(
												(label) =>
													label.id === selectedLabel
											)?.name
										: 'Select label'}
									<Check className="ml-2 h-4 w-4 shrink-0 opacity-50" />
								</Button>
							</PopoverTrigger>
							<PopoverContent className="w-[300px] p-0">
								<Command>
									<CommandInput placeholder="Search label..." />
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
														setSelectedLabel(
															selectedLabel ===
																label.id
																? null
																: label.id
														)
													}}
												>
													<Check
														className={`mr-2 h-4 w-4 ${selectedLabel === label.id ? 'opacity-100' : 'opacity-0'}`}
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
					</div>

					<DialogFooter>
						<Button
							variant="outline"
							onClick={() => setShowLabelDialog(false)}
						>
							Cancel
						</Button>
						<Button
							onClick={() =>
								handleBulkOperation(
									selectedLabel ? 'addLabel' : ''
								)
							}
							disabled={!selectedLabel || isLoading}
						>
							Apply
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	)
}
