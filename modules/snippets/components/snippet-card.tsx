'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter, useParams } from 'next/navigation'
import { formatDistanceToNow } from 'date-fns'
import {
	FolderArchiveIcon as ArchiveBox,
	Copy,
	ExternalLink,
	MoreHorizontal,
	Pencil,
	Pin,
	Star,
	Trash2,
} from 'lucide-react'
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useToast } from '@/hooks/use-toast'
import {
	deleteSnippet,
	togglePinSnippet,
	toggleFavoriteSnippet,
	toggleArchiveSnippet,
} from '@/modules/snippets/api/mutations'
import { EditSnippetDialog } from './edit-snippet-dialog'
import { SnippetSyntaxHighlighter } from './snippet-syntax-highlighter'
import { Checkbox } from '@/components/ui/checkbox'

interface SnippetCardProps {
	snippet: {
		id: string
		title: string
		content: string
		language: string
		isPublic: boolean
		isPinned: boolean
		isFavorite: boolean
		isArchived: boolean
		shareId: string | null
		createdAt: Date
		updatedAt: Date
		category: {
			id: string
			name: string
		} | null
		labels: {
			id: string
			name: string
			color: string
		}[]
		creator?: {
			id: string
			firstName: string
			lastName: string
		} | null
	}
	selectable?: boolean
	selected?: boolean
	onSelectChange?: (id: string, selected: boolean) => void
}

export function SnippetCard({
	snippet,
	selectable = false,
	selected = false,
	onSelectChange,
}: SnippetCardProps) {
	const router = useRouter()
	const params = useParams<{ slug: string }>()
	const { toast } = useToast()
	const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
	const [isDeleting, setIsDeleting] = useState(false)
	const [isPinning, setIsPinning] = useState(false)
	const [isFavoriting, setIsFavoriting] = useState(false)
	const [isArchiving, setIsArchiving] = useState(false)

	// Format the date
	const formattedDate = formatDistanceToNow(new Date(snippet.updatedAt), {
		addSuffix: true,
	})

	// Truncate content for preview
	const previewContent =
		snippet.content.length > 200
			? `${snippet.content.substring(0, 200)}...`
			: snippet.content

	// Handle copy to clipboard
	const handleCopy = () => {
		navigator.clipboard.writeText(snippet.content)
		toast({
			title: 'Copied to clipboard',
			description: 'Snippet content has been copied to your clipboard',
		})
	}

	// Handle pin toggle
	const handleTogglePin = async () => {
		setIsPinning(true)
		try {
			const result = await togglePinSnippet(snippet.id)
			if (result.error) {
				toast({
					title: 'Error',
					description: result.error,
					variant: 'destructive',
				})
			} else {
				toast({
					title: snippet.isPinned ? 'Unpinned' : 'Pinned',
					description: snippet.isPinned
						? 'Snippet unpinned successfully'
						: 'Snippet pinned successfully',
				})
				router.refresh()
			}
		} catch (error) {
			toast({
				title: 'Error',
				description: 'Failed to update snippet',
				variant: 'destructive',
			})
		} finally {
			setIsPinning(false)
		}
	}

	// Handle favorite toggle
	const handleToggleFavorite = async () => {
		setIsFavoriting(true)
		try {
			const result = await toggleFavoriteSnippet(snippet.id)
			if (result.error) {
				toast({
					title: 'Error',
					description: result.error,
					variant: 'destructive',
				})
			} else {
				toast({
					title: snippet.isFavorite
						? 'Removed from favorites'
						: 'Added to favorites',
					description: snippet.isFavorite
						? 'Snippet removed from favorites'
						: 'Snippet added to favorites',
				})
				router.refresh()
			}
		} catch (error) {
			toast({
				title: 'Error',
				description: 'Failed to update snippet',
				variant: 'destructive',
			})
		} finally {
			setIsFavoriting(false)
		}
	}

	// Handle archive toggle
	const handleToggleArchive = async () => {
		setIsArchiving(true)
		try {
			const result = await toggleArchiveSnippet(snippet.id)
			if (result.error) {
				toast({
					title: 'Error',
					description: result.error,
					variant: 'destructive',
				})
			} else {
				toast({
					title: snippet.isArchived ? 'Unarchived' : 'Archived',
					description: snippet.isArchived
						? 'Snippet restored from archive'
						: 'Snippet moved to archive',
				})
				router.refresh()
			}
		} catch (error) {
			toast({
				title: 'Error',
				description: 'Failed to update snippet',
				variant: 'destructive',
			})
		} finally {
			setIsArchiving(false)
		}
	}

	// Handle delete
	const handleDelete = async () => {
		if (confirm('Are you sure you want to delete this snippet?')) {
			setIsDeleting(true)

			try {
				const result = await deleteSnippet(snippet.id)

				if (result.error) {
					toast({
						title: 'Error',
						description: result.error,
						variant: 'destructive',
					})
				} else {
					toast({
						title: 'Success',
						description: 'Snippet deleted successfully',
					})
					router.refresh()
				}
			} catch (error) {
				toast({
					title: 'Error',
					description: 'Failed to delete snippet',
					variant: 'destructive',
				})
			} finally {
				setIsDeleting(false)
			}
		}
	}

	// Handle selection change
	const handleSelectionChange = (checked: boolean) => {
		if (onSelectChange) {
			onSelectChange(snippet.id, checked)
		}
	}

	return (
		<>
			<Card className={`${snippet.isPinned ? 'border-primary/50' : ''}`}>
				<CardHeader className="pb-2">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-2">
							{selectable && (
								<Checkbox
									checked={selected}
									onCheckedChange={handleSelectionChange}
									aria-label={`Select ${snippet.title}`}
								/>
							)}
							<CardTitle className="text-lg">
								<Link
									href={`/dashboard/workspaces/${params.slug}/snippets/${snippet.id}`}
									className="hover:underline focus:outline-none focus:underline"
								>
									{snippet.title}
								</Link>
							</CardTitle>
						</div>
						<div className="flex items-center space-x-2">
							{snippet.isPinned && (
								<Pin className="h-4 w-4 text-primary" />
							)}
							{snippet.isFavorite && (
								<Star className="h-4 w-4 text-yellow-500" />
							)}
							{snippet.isPublic && (
								<Badge
									variant="outline"
									className="bg-green-50 text-green-700 border-green-200"
								>
									Public
								</Badge>
							)}
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button
										variant="ghost"
										size="sm"
										className="h-8 w-8 p-0"
									>
										<MoreHorizontal className="h-4 w-4" />
										<span className="sr-only">
											Open menu
										</span>
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent align="end">
									<DropdownMenuItem
										onClick={() =>
											setIsEditDialogOpen(true)
										}
									>
										<Pencil className="mr-2 h-4 w-4" />
										Edit
									</DropdownMenuItem>
									<DropdownMenuItem onClick={handleCopy}>
										<Copy className="mr-2 h-4 w-4" />
										Copy to clipboard
									</DropdownMenuItem>
									<DropdownMenuItem
										onClick={handleTogglePin}
										disabled={isPinning}
									>
										<Pin className="mr-2 h-4 w-4" />
										{snippet.isPinned ? 'Unpin' : 'Pin'}
									</DropdownMenuItem>
									<DropdownMenuItem
										onClick={handleToggleFavorite}
										disabled={isFavoriting}
									>
										<Star className="mr-2 h-4 w-4" />
										{snippet.isFavorite
											? 'Remove from favorites'
											: 'Add to favorites'}
									</DropdownMenuItem>
									<DropdownMenuItem
										onClick={handleToggleArchive}
										disabled={isArchiving}
									>
										<ArchiveBox className="mr-2 h-4 w-4" />
										{snippet.isArchived
											? 'Restore from archive'
											: 'Move to archive'}
									</DropdownMenuItem>
									{snippet.isPublic && snippet.shareId && (
										<DropdownMenuItem asChild>
											<Link
												href={`/s/${snippet.shareId}`}
												target="_blank"
											>
												<ExternalLink className="mr-2 h-4 w-4" />
												Open shared link
											</Link>
										</DropdownMenuItem>
									)}
									<DropdownMenuSeparator />
									<DropdownMenuItem
										onClick={handleDelete}
										disabled={isDeleting}
										className="text-red-600"
									>
										<Trash2 className="mr-2 h-4 w-4" />
										Delete
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						</div>
					</div>
				</CardHeader>
				<CardContent>
					<Link
						href={`/dashboard/workspaces/${params.slug}/snippets/${snippet.id}`}
						className="block focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-md"
					>
						<div className="bg-muted rounded-md overflow-x-auto max-h-[200px]">
							<SnippetSyntaxHighlighter
								code={previewContent}
								language={snippet.language}
								showLineNumbers={false}
							/>
						</div>
					</Link>

					<div className="mt-4 flex flex-wrap gap-2">
						{snippet.category && (
							<Badge variant="secondary">
								{snippet.category.name}
							</Badge>
						)}

						{snippet.labels.map((label) => (
							<Badge
								key={label.id}
								style={{
									backgroundColor: `${label.color}20`,
									color: label.color,
									borderColor: `${label.color}40`,
								}}
								variant="outline"
							>
								{label.name}
							</Badge>
						))}
					</div>
				</CardContent>
				<CardFooter className="text-xs text-muted-foreground flex justify-between">
					<span>Last updated {formattedDate}</span>
					{snippet.creator && (
						<span>
							By {snippet.creator.firstName}{' '}
							{snippet.creator.lastName}
						</span>
					)}
				</CardFooter>
			</Card>

			<EditSnippetDialog
				snippet={snippet}
				open={isEditDialogOpen}
				onOpenChange={setIsEditDialogOpen}
			/>
		</>
	)
}
