'use client'

import {
	Input,
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from 'ui'

type ChangelogFiltersProps = {
	onSearchChange: (value: string) => void
	onAuthorFilter: (author: string) => void
	onDateRangeFilter: (range: string) => void
	authors: string[]
}

export default function ChangelogFilters({
	onSearchChange,
	onAuthorFilter,
	onDateRangeFilter,
	authors
}: ChangelogFiltersProps) {
	return (
		<div className="flex flex-col md:flex-row gap-4 mb-6">
			<Input
				placeholder="Search commits..."
				onChange={(e) => onSearchChange(e.target.value)}
				className="md:w-64"
			/>
			<Select onValueChange={onAuthorFilter}>
				<SelectTrigger className="md:w-48">
					<SelectValue placeholder="Filter by author" />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="all">All authors</SelectItem>
					{authors.map((author) => (
						<SelectItem key={author} value={author}>
							{author}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
			<Select onValueChange={onDateRangeFilter}>
				<SelectTrigger className="md:w-48">
					<SelectValue placeholder="Date range" />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="all">All time</SelectItem>
					<SelectItem value="today">Today</SelectItem>
					<SelectItem value="week">This week</SelectItem>
					<SelectItem value="month">This month</SelectItem>
				</SelectContent>
			</Select>
		</div>
	)
}
