'use client'

import { motion } from 'framer-motion'
import type { ChangelogGroup } from '../types/changelog'
import { ChangelogEntry } from './changelog-entry'

interface ChangelogMonthGroupProps {
	group: ChangelogGroup
}

export function ChangelogMonthGroup({ group }: ChangelogMonthGroupProps) {
	return (
		<div className="mb-12">
			<motion.h2
				className="text-2xl font-bold text-[#F2F0ED] mb-6 flex items-center"
				initial={{ opacity: 0, x: -20 }}
				animate={{ opacity: 1, x: 0 }}
				transition={{ duration: 0.3 }}
			>
				<span>{group.month}</span>
				<span className="ml-2 text-[#8C877D]">{group.year}</span>
			</motion.h2>

			<div>
				{group.entries.map((entry) => (
					<ChangelogEntry
						key={entry.id}
						entry={entry}
					/>
				))}
			</div>
		</div>
	)
}
