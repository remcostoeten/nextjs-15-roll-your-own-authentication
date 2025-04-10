import {
	getWorkspaceCategories,
	getWorkspaceLabels,
} from '@/modules/snippets/api/queries'
import Link from 'next/link'
import { Check, Filter } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { CreateCategoryDialog } from './create-category-dialog'
import { CreateLabelDialog } from './create-label-dialog'
import { ScrollArea } from '@/components/ui/scroll-area'

interface SnippetsFiltersProps {
	workspaceId: string
	currentCategoryId: string | null
	currentLabelIds: string[]
	isPublicOnly: boolean
}

export async function SnippetsFilters({
	workspaceId,
	currentCategoryId,
	currentLabelIds,
	isPublicOnly,
}: SnippetsFiltersProps) {
	// Fetch categories and labels
	const categories = await getWorkspaceCategories(workspaceId)
	const labels = await getWorkspaceLabels(workspaceId)

	// Helper to generate filter URLs
	const getFilterUrl = (
		type: 'category' | 'label' | 'public',
		id?: string,
		isActive = false
	) => {
		const params = new URLSearchParams()

		// Handle category filter
		if (type === 'category') {
			if (!isActive && id) {
				params.set('category', id)
			}
		} else if (currentCategoryId) {
			params.set('category', currentCategoryId)
		}

		// Handle label filter
		if (type === 'label') {
			const newLabelIds = isActive
				? currentLabelIds.filter((labelId) => labelId !== id)
				: [...currentLabelIds, id!]

			if (newLabelIds.length > 0) {
				params.set('labels', newLabelIds.join(','))
			}
		} else if (currentLabelIds.length > 0) {
			params.set('labels', currentLabelIds.join(','))
		}

		// Handle public filter
		if (type === 'public') {
			if (!isPublicOnly) {
				params.set('public', 'true')
			}
		} else if (isPublicOnly) {
			params.set('public', 'true')
		}

		return `?${params.toString()}`
	}

	// Check if any filters are active
	const hasActiveFilters =
		currentCategoryId || currentLabelIds.length > 0 || isPublicOnly

	return (
		<div className="space-y-6 sticky top-4">
			<div className="flex items-center justify-between mb-2">
				<h2 className="text-sm font-semibold">Filters</h2>
				{hasActiveFilters && (
					<Button
						variant="ghost"
						size="sm"
						asChild
						className="h-8 px-2"
					>
						<Link href="?">
							<Filter className="h-3.5 w-3.5 mr-1" />
							Clear all
						</Link>
					</Button>
				)}
			</div>

			<div>
				<div className="flex items-center justify-between mb-2">
					<h3 className="text-sm font-medium">Visibility</h3>
				</div>
				<div className="space-y-1">
					<Link
						href={getFilterUrl('public', undefined, isPublicOnly)}
					>
						<Button
							variant={isPublicOnly ? 'default' : 'ghost'}
							className="w-full justify-start"
							size="sm"
						>
							{isPublicOnly && <Check className="mr-2 h-4 w-4" />}
							Public only
						</Button>
					</Link>
				</div>
			</div>

			<Separator />

			<div>
				<div className="flex items-center justify-between mb-2">
					<h3 className="text-sm font-medium">Categories</h3>
					<CreateCategoryDialog workspaceId={workspaceId} />
				</div>

				<ScrollArea className="h-[180px] pr-4">
					<div className="space-y-1">
						<Link href="?">
							<Button
								variant={
									!currentCategoryId ? 'default' : 'ghost'
								}
								className="w-full justify-start"
								size="sm"
							>
								{!currentCategoryId && (
									<Check className="mr-2 h-4 w-4" />
								)}
								All Categories
							</Button>
						</Link>

						{categories.map((category) => (
							<Link
								key={category.id}
								href={getFilterUrl(
									'category',
									category.id,
									currentCategoryId === category.id
								)}
							>
								<Button
									variant={
										currentCategoryId === category.id
											? 'default'
											: 'ghost'
									}
									className="w-full justify-start"
									size="sm"
								>
									{currentCategoryId === category.id && (
										<Check className="mr-2 h-4 w-4" />
									)}
									{category.name}
									<Badge
										variant="outline"
										className="ml-auto"
									>
										{category.snippetCount}
									</Badge>
								</Button>
							</Link>
						))}
					</div>
				</ScrollArea>
			</div>

			<Separator />

			<div>
				<div className="flex items-center justify-between mb-2">
					<h3 className="text-sm font-medium">Labels</h3>
					<CreateLabelDialog workspaceId={workspaceId} />
				</div>

				<ScrollArea className="h-[180px] pr-4">
					<div className="space-y-1">
						{labels.map((label) => {
							const isActive = currentLabelIds.includes(label.id)

							return (
								<Link
									key={label.id}
									href={getFilterUrl(
										'label',
										label.id,
										isActive
									)}
								>
									<Button
										variant={isActive ? 'default' : 'ghost'}
										className="w-full justify-start"
										size="sm"
									>
										{isActive && (
											<Check className="mr-2 h-4 w-4" />
										)}
										<span
											className="h-2 w-2 rounded-full mr-2"
											style={{
												backgroundColor: label.color,
											}}
										/>
										{label.name}
										<Badge
											variant="outline"
											className="ml-auto"
										>
											{label.snippetCount}
										</Badge>
									</Button>
								</Link>
							)
						})}
					</div>
				</ScrollArea>
			</div>
		</div>
	)
}
