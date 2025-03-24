'use client'

import type React from 'react'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Filter, Search, X } from 'lucide-react'

type FilterCategory = 'status' | 'priority' | 'category' | 'tag'

interface FilterOption {
	category: FilterCategory
	value: string
	label: string
}

interface RoadmapFilterProps {
	onFilterChange: (filters: FilterOption[]) => void
}

export function RoadmapFilter({ onFilterChange }: RoadmapFilterProps) {
	const [isOpen, setIsOpen] = useState(false)
	const [searchQuery, setSearchQuery] = useState('')
	const [activeFilters, setActiveFilters] = useState<FilterOption[]>([])

	const filterOptions: Record<FilterCategory, { label: string; options: { value: string; label: string }[] }> = {
		status: {
			label: 'Status',
			options: [
				{ value: 'planned', label: 'Planned' },
				{ value: 'in-progress', label: 'In Progress' },
				{ value: 'completed', label: 'Completed' },
				{ value: 'cancelled', label: 'Cancelled' },
			],
		},
		priority: {
			label: 'Priority',
			options: [
				{ value: 'critical', label: 'Critical' },
				{ value: 'high', label: 'High' },
				{ value: 'medium', label: 'Medium' },
				{ value: 'low', label: 'Low' },
			],
		},
		category: {
			label: 'Category',
			options: [
				{ value: 'feature', label: 'Feature' },
				{ value: 'improvement', label: 'Improvement' },
				{ value: 'bugfix', label: 'Bugfix' },
				{ value: 'security', label: 'Security' },
				{ value: 'performance', label: 'Performance' },
				{ value: 'documentation', label: 'Documentation' },
			],
		},
		tag: {
			label: 'Tags',
			options: [
				{ value: 'authentication', label: 'Authentication' },
				{ value: 'security', label: 'Security' },
				{ value: 'ux', label: 'UX' },
				{ value: 'jwt', label: 'JWT' },
				{ value: 'oauth', label: 'OAuth' },
				{ value: 'webauthn', label: 'WebAuthn' },
				{ value: '2fa', label: '2FA' },
			],
		},
	}

	const toggleFilter = (category: FilterCategory, value: string, label: string) => {
		const filterOption: FilterOption = { category, value, label }
		const filterExists = activeFilters.some((filter) => filter.category === category && filter.value === value)

		let newFilters: FilterOption[]
		if (filterExists) {
			newFilters = activeFilters.filter((filter) => !(filter.category === category && filter.value === value))
		} else {
			newFilters = [...activeFilters, filterOption]
		}

		setActiveFilters(newFilters)
		onFilterChange(newFilters)
	}

	const clearFilters = () => {
		setActiveFilters([])
		onFilterChange([])
	}

	const handleSearch = (e: React.FormEvent) => {
		e.preventDefault()
		// Implement search functionality
		console.log('Searching for:', searchQuery)
	}

	return (
		<div className="mb-6">
			<div className="flex flex-wrap items-center gap-3">
				{/* Search input */}
				<form
					onSubmit={handleSearch}
					className="flex-1"
				>
					<div className="relative">
						<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8C877D]" />
						<input
							type="text"
							placeholder="Search roadmap..."
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className="w-full rounded-md border border-[#1E1E1E] bg-[#0D0C0C] py-2 pl-10 pr-4 text-[#F2F0ED] focus:outline-none focus:ring-1 focus:ring-[#4e9815]"
						/>
					</div>
				</form>

				{/* Filter button */}
				<button
					className={`flex items-center gap-2 rounded-md px-3 py-2 transition-colors ${
						isOpen || activeFilters.length > 0
							? 'bg-[#4e9815]/20 text-[#4e9815]'
							: 'border border-[#1E1E1E] text-[#8C877D] hover:bg-[#1E1E1E]'
					}`}
					onClick={() => setIsOpen(!isOpen)}
				>
					<Filter className="h-4 w-4" />
					<span>Filter</span>
					{activeFilters.length > 0 && (
						<span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#4e9815] text-xs text-white">
							{activeFilters.length}
						</span>
					)}
				</button>

				{/* Clear filters button */}
				{activeFilters.length > 0 && (
					<button
						className="flex items-center gap-1 rounded-md px-2 py-1 text-xs text-[#8C877D] hover:text-[#F2F0ED] transition-colors"
						onClick={clearFilters}
					>
						<X className="h-3 w-3" />
						<span>Clear filters</span>
					</button>
				)}
			</div>

			{/* Active filters */}
			{activeFilters.length > 0 && (
				<div className="mt-3 flex flex-wrap gap-2">
					{activeFilters.map((filter) => (
						<div
							key={`${filter.category}-${filter.value}`}
							className="flex items-center gap-1 rounded-md bg-[#1E1E1E] px-2 py-1 text-xs text-[#F2F0ED]"
						>
							<span className="text-[#8C877D]">{filterOptions[filter.category].label}:</span>
							<span>{filter.label}</span>
							<button
								className="ml-1 rounded-full p-0.5 hover:bg-[#2D2D2D] transition-colors"
								onClick={() => toggleFilter(filter.category, filter.value, filter.label)}
							>
								<X className="h-3 w-3" />
							</button>
						</div>
					))}
				</div>
			)}

			{/* Filter dropdown */}
			<AnimatePresence>
				{isOpen && (
					<motion.div
						className="mt-3 grid grid-cols-2 gap-4 rounded-md border border-[#1E1E1E] bg-[#0D0C0C] p-4 md:grid-cols-4"
						initial={{ opacity: 0, height: 0 }}
						animate={{ opacity: 1, height: 'auto' }}
						exit={{ opacity: 0, height: 0 }}
						transition={{ duration: 0.2 }}
					>
						{Object.entries(filterOptions).map(([category, { label, options }]) => (
							<div
								key={category}
								className="space-y-2"
							>
								<h3 className="font-medium text-[#F2F0ED]">{label}</h3>
								<div className="space-y-1">
									{options.map((option) => {
										const isActive = activeFilters.some(
											(filter) => filter.category === category && filter.value === option.value
										)
										return (
											<button
												key={option.value}
												className={`flex w-full items-center gap-2 rounded-md px-2 py-1 text-left text-sm transition-colors ${
													isActive
														? 'bg-[#4e9815]/20 text-[#4e9815]'
														: 'text-[#8C877D] hover:bg-[#1E1E1E]'
												}`}
												onClick={() =>
													toggleFilter(category as FilterCategory, option.value, option.label)
												}
											>
												<div
													className={`h-3 w-3 rounded-full ${isActive ? 'bg-[#4e9815]' : 'bg-[#1E1E1E]'}`}
												/>
												<span>{option.label}</span>
											</button>
										)
									})}
								</div>
							</div>
						))}
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	)
}
