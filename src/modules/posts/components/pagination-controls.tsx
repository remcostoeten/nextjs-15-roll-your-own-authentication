'use client'

import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/shared/utils/cn'

interface PaginationControlsProps {
	currentPage: number
	totalPages: number
	basePath: string
}

export function PaginationControls({
	currentPage,
	totalPages,
	basePath,
}: PaginationControlsProps) {
	// Generate array of page numbers to display
	const getPageNumbers = () => {
		const pageNumbers = []
		const maxPagesToShow = 5

		if (totalPages <= maxPagesToShow) {
			// Show all pages if total is less than max to show
			for (let i = 1; i <= totalPages; i++) {
				pageNumbers.push(i)
			}
		} else {
			// Always include first page
			pageNumbers.push(1)

			// Calculate start and end of middle pages
			let start = Math.max(2, currentPage - 1)
			let end = Math.min(totalPages - 1, currentPage + 1)

			// Adjust if we're at start or end
			if (currentPage <= 2) {
				end = Math.min(totalPages - 1, maxPagesToShow - 1)
			} else if (currentPage >= totalPages - 1) {
				start = Math.max(2, totalPages - maxPagesToShow + 2)
			}

			// Add ellipsis if needed
			if (start > 2) {
				pageNumbers.push('ellipsis-start')
			}

			// Add middle pages
			for (let i = start; i <= end; i++) {
				pageNumbers.push(i)
			}

			// Add ellipsis if needed
			if (end < totalPages - 1) {
				pageNumbers.push('ellipsis-end')
			}

			// Always include last page
			pageNumbers.push(totalPages)
		}

		return pageNumbers
	}

	const pageNumbers = getPageNumbers()

	return (
		<div className="flex items-center justify-center py-4">
			<div className="flex items-center gap-1 border border-button-border rounded-md overflow-hidden">
				{/* Previous button */}
				<Link
					href={
						currentPage > 1
							? `${basePath}?page=${currentPage - 1}`
							: '#'
					}
					aria-disabled={currentPage === 1}
					className={cn(
						'flex items-center justify-center h-10 w-10 transition-colors',
						currentPage === 1
							? 'text-button/50 pointer-events-none'
							: 'text-button hover:text-title-light hover:bg-background-lighter'
					)}
				>
					<ChevronLeft className="h-5 w-5" />
				</Link>

				{/* Page numbers */}
				{pageNumbers.map((page, index) => {
					if (page === 'ellipsis-start' || page === 'ellipsis-end') {
						return (
							<span
								key={page}
								className="flex items-center justify-center h-10 w-10 text-button"
							>
								...
							</span>
						)
					}

					return (
						<Link
							key={index}
							href={`${basePath}?page=${page}`}
							className={cn(
								'flex items-center justify-center h-10 w-10 transition-colors',
								currentPage === page
									? 'bg-background-lighter text-title-light'
									: 'text-button hover:text-title-light hover:bg-background-lighter'
							)}
						>
							{page}
						</Link>
					)
				})}

				{/* Next button */}
				<Link
					href={
						currentPage < totalPages
							? `${basePath}?page=${currentPage + 1}`
							: '#'
					}
					aria-disabled={currentPage === totalPages}
					className={cn(
						'flex items-center justify-center h-10 w-10 transition-colors',
						currentPage === totalPages
							? 'text-button/50 pointer-events-none'
							: 'text-button hover:text-title-light hover:bg-background-lighter'
					)}
				>
					<ChevronRight className="h-5 w-5" />
				</Link>
			</div>
		</div>
	)
}
