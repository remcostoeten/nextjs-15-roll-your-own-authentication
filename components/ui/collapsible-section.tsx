'use client'

import { useUIStore } from '@/stores/ui-store'
import { cn } from 'helpers'
import { ChevronDown } from 'lucide-react'
import { useEffect, useState } from 'react'

type CollapsibleSectionProps = {
	id: string
	title: React.ReactNode
	children: React.ReactNode
	icon?: React.ReactNode
	defaultOpen?: boolean
	className?: string
}

export function CollapsibleSection({
	id,
	title,
	children,
	icon,
	defaultOpen = true,
	className
}: CollapsibleSectionProps) {
	// For hydration safety
	const [mounted, setMounted] = useState(false)
	const { isSectionClosed, toggleSection } = useUIStore()

	useEffect(() => {
		setMounted(true)
	}, [])

	if (!mounted) {
		return null // Or a loading skeleton
	}

	const isCollapsed = isSectionClosed(id)

	return (
		<div
			className={cn(
				'bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-gray-200 dark:border-neutral-700',
				className
			)}
		>
			<button
				onClick={() => toggleSection(id)}
				className="w-full flex items-center justify-between p-6 text-left"
			>
				<div className="flex items-center gap-2">
					{icon}
					<h2 className="text-xl font-semibold text-gray-900 dark:text-white">
						{title}
					</h2>
				</div>
				<ChevronDown
					className={cn(
						'h-5 w-5 text-gray-500 transition-transform duration-200',
						!isCollapsed && 'transform rotate-180'
					)}
				/>
			</button>
			<div
				className={cn(
					'transition-all duration-200 ease-in-out',
					isCollapsed ? 'max-h-0 overflow-hidden' : 'max-h-[2000px]'
				)}
			>
				<div className="p-6 pt-0">{children}</div>
			</div>
		</div>
	)
}
