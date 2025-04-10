import type React from 'react'
import { FileCode, Search, SlidersHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface EmptyStateProps {
	title: string
	description: string
	hasFilters?: boolean
	action?: React.ReactNode
}

export function EmptyState({
	title,
	description,
	hasFilters = false,
	action,
}: EmptyStateProps) {
	return (
		<div className="flex flex-col items-center justify-center h-64 border rounded-lg p-6 text-center">
			{hasFilters ? (
				<div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
					<Search className="h-6 w-6 text-muted-foreground" />
				</div>
			) : (
				<div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
					<FileCode className="h-6 w-6 text-muted-foreground" />
				</div>
			)}
			<h3 className="text-lg font-medium">{title}</h3>
			<p className="text-muted-foreground mt-2 mb-4 max-w-md">
				{description}
			</p>

			{hasFilters && (
				<Button
					variant="outline"
					size="sm"
					asChild
				>
					<a href="?">
						<SlidersHorizontal className="mr-2 h-4 w-4" />
						Clear filters
					</a>
				</Button>
			)}

			{action && action}
		</div>
	)
}
