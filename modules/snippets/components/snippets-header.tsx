'use client'

import type React from 'react'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Plus, Search, SortAsc, SortDesc } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { CreateSnippetDialog } from './create-snippet-dialog'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface SnippetsHeaderProps {
	workspace: {
		id: string
		name: string
		slug: string
	}
}

export function SnippetsHeader({ workspace }: SnippetsHeaderProps) {
	const router = useRouter()
	const searchParams = useSearchParams()
	const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
	const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '')

	const currentSort = searchParams.get('sort') || 'createdAt'
	const currentOrder = searchParams.get('order') || 'desc'

	const handleSearch = (e: React.FormEvent) => {
		e.preventDefault()

		// Update URL with search query
		const params = new URLSearchParams(searchParams.toString())
		if (searchQuery) {
			params.set('q', searchQuery)
		} else {
			params.delete('q')
		}

		router.push(
			`/dashboard/workspaces/${workspace.slug}/snippets?${params.toString()}`
		)
	}

	const handleSort = (sort: string, order: string) => {
		const params = new URLSearchParams(searchParams.toString())
		params.set('sort', sort)
		params.set('order', order)
		router.push(
			`/dashboard/workspaces/${workspace.slug}/snippets?${params.toString()}`
		)
	}

	return (
		<div className="flex flex-col space-y-4">
			<div className="flex items-center justify-between">
				<h1 className="text-2xl font-bold tracking-tight">Snippets</h1>
				<Button onClick={() => setIsCreateDialogOpen(true)}>
					<Plus className="mr-2 h-4 w-4" />
					New Snippet
				</Button>
			</div>

			<div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
				<form
					onSubmit={handleSearch}
					className="flex-1 w-full"
				>
					<div className="relative">
						<Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
						<Input
							type="search"
							placeholder="Search snippets..."
							className="w-full pl-8"
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
						/>
					</div>
				</form>

				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button
							variant="outline"
							size="sm"
						>
							{currentOrder === 'desc' ? (
								<SortDesc className="mr-2 h-4 w-4" />
							) : (
								<SortAsc className="mr-2 h-4 w-4" />
							)}
							Sort: {getSortLabel(currentSort, currentOrder)}
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						<DropdownMenuItem
							onClick={() => handleSort('createdAt', 'desc')}
						>
							Newest first
						</DropdownMenuItem>
						<DropdownMenuItem
							onClick={() => handleSort('createdAt', 'asc')}
						>
							Oldest first
						</DropdownMenuItem>
						<DropdownMenuItem
							onClick={() => handleSort('title', 'asc')}
						>
							Title (A-Z)
						</DropdownMenuItem>
						<DropdownMenuItem
							onClick={() => handleSort('title', 'desc')}
						>
							Title (Z-A)
						</DropdownMenuItem>
						<DropdownMenuItem
							onClick={() => handleSort('updatedAt', 'desc')}
						>
							Recently updated
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>

			<CreateSnippetDialog
				workspaceId={workspace.id}
				workspaceSlug={workspace.slug}
				open={isCreateDialogOpen}
				onOpenChange={setIsCreateDialogOpen}
			/>
		</div>
	)
}

function getSortLabel(sort: string, order: string): string {
	switch (sort) {
		case 'title':
			return order === 'asc' ? 'Title (A-Z)' : 'Title (Z-A)'
		case 'updatedAt':
			return order === 'desc' ? 'Recently updated' : 'Oldest updated'
		case 'createdAt':
		default:
			return order === 'desc' ? 'Newest first' : 'Oldest first'
	}
}
