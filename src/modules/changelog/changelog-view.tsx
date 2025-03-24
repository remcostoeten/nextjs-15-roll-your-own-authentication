'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { changelogEntries, groupChangelogEntriesByMonth } from './data/changelog-data'
import type { ChangelogCategory } from './types/changelog'
import { ChangelogFilter } from './components/changelog-filter'
import { ChangelogMonthGroup } from './components/changelog-month-group'
// Update the footer import
import { Footer } from '../../modules/(homepage)/components/footer'

// In the ChangelogMonthGroup component:
// export function ChangelogMonthGroup({ group, isAdmin }: ChangelogMonthGroupProps & { isAdmin?: boolean }) {
//   return (
//     <div className="mb-12">
//       <motion.h2
//         className="text-2xl font-bold text-[#F2F0ED] mb-6 flex items-center"
//         initial={{ opacity: 0, x: -20 }}
//         animate={{ opacity: 1, x: 0 }}
//         transition={{ duration: 0.3 }}
//       >
//         <span>{group.month}</span>
//         <span className="ml-2 text-[#8C877D]">{group.year}</span>
//       </motion.h2>

//       <div>
//         {group.entries.map((entry) => (
//           <ChangelogEntry key={entry.id} entry={entry} isAdmin={isAdmin} />
//         ))}
//       </div>
//     </div>
//   )
// }

// In the main ChangelogView component:
export default function ChangelogView() {
	const [activeFilters, setActiveFilters] = useState<ChangelogCategory[]>([])
	const [sortBy, setSortBy] = useState<'date' | 'votes'>('date')
	const [isAdmin, setIsAdmin] = useState(false) // For demo purposes, default to false

	// Add a toggle for admin mode (for demo purposes)
	const toggleAdminMode = () => {
		setIsAdmin(!isAdmin)
	}

	// Get all unique categories from entries
	const allCategories = useMemo(() => {
		const categories = new Set<ChangelogCategory>()
		changelogEntries.forEach((entry) => {
			entry.categories.forEach((category) => {
				categories.add(category)
			})
		})
		return Array.from(categories)
	}, [])

	// Filter entries based on active filters
	const filteredEntries = useMemo(() => {
		if (activeFilters.length === 0) {
			return changelogEntries
		}

		return changelogEntries.filter((entry) => entry.categories.some((category) => activeFilters.includes(category)))
	}, [activeFilters])

	// Sort entries based on sort option
	const sortedEntries = useMemo(() => {
		if (sortBy === 'votes') {
			return [...filteredEntries].sort((a, b) => (b.votes || 0) - (a.votes || 0))
		}
		// Default sort by date (newest first)
		return filteredEntries
	}, [filteredEntries, sortBy])

	// Group filtered and sorted entries by month
	const groupedEntries = useMemo(() => {
		return groupChangelogEntriesByMonth(sortedEntries)
	}, [sortedEntries])

	return (
		<div className="min-h-screen">
			<main className="container mx-auto px-6 pt-32 pb-16">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
					className="mx-auto max-w-3xl"
				>
					<div className="mb-12 text-center">
						<h1 className="text-4xl font-bold tracking-tight text-[#F2F0ED] md:text-5xl">Changelog</h1>
						<p className="mt-4 text-lg text-[#8C877D]">
							Stay up to date with the latest improvements and updates to Roll Your Own Auth.
							<br />
							<span className="text-sm italic">Vote for features you find most useful!</span>
						</p>

						{/* Add admin mode toggle for demo purposes */}
						<button
							onClick={toggleAdminMode}
							className="mt-2 text-xs px-2 py-1 rounded-md bg-[#1E1E1E] text-[#8C877D] hover:text-[#F2F0ED]"
						>
							{isAdmin ? 'Exit Admin Mode' : 'Enter Admin Mode'}
						</button>
					</div>

					<ChangelogFilter
						categories={allCategories}
						activeFilters={activeFilters}
						onFilterChange={setActiveFilters}
						onSortChange={setSortBy}
						sortBy={sortBy}
					/>

					{groupedEntries.length > 0 ? (
						groupedEntries.map((group) => (
							<ChangelogMonthGroup
								key={`${group.year}-${group.month}`}
								group={group}
								isAdmin={isAdmin}
							/>
						))
					) : (
						<div className="text-center py-12">
							<p className="text-[#8C877D]">No changelog entries match your filters.</p>
							<button
								onClick={() => setActiveFilters([])}
								className="mt-4 text-sm text-[#4e9815] hover:underline"
							>
								Clear filters
							</button>
						</div>
					)}
				</motion.div>
			</main>
			<Footer />
		</div>
	)
}
