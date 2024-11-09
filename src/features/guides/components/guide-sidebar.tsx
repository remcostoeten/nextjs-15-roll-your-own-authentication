'use client'

import { cn } from '@/lib/utils'
import { ChevronRight } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from 'ui'
import type { GuideSection } from '../types/guide'

type GuideSidebarProps = {
	sections: GuideSection[]
	className?: string
	collapsible?: boolean
	defaultOpenSections?: string[]
}

export default function GuideSidebar({
	sections,
	className,
	collapsible = true,
	defaultOpenSections = []
}: GuideSidebarProps) {
	const [activeSection, setActiveSection] = useState<string>(sections[0]?.id)
	const [openSections, setOpenSections] = useState<Set<string>>(
		new Set(defaultOpenSections)
	)

	useEffect(() => {
		// Track all visible sections
		const visibleSections = new Map<string, number>()

		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						visibleSections.set(
							entry.target.id,
							entry.intersectionRatio
						)
					} else {
						visibleSections.delete(entry.target.id)
					}
				})

				// Find the section that is most visible in the viewport
				let maxRatio = 0
				let mostVisibleSection = ''

				visibleSections.forEach((ratio, sectionId) => {
					// Prioritize sections closer to the top of the viewport
					const element = document.getElementById(sectionId)
					const position = element?.getBoundingClientRect().top || 0
					const adjustedRatio =
						ratio * (1 + 1 / (Math.abs(position) + 1))

					if (adjustedRatio > maxRatio) {
						maxRatio = adjustedRatio
						mostVisibleSection = sectionId
					}
				})

				if (mostVisibleSection) {
					setActiveSection(mostVisibleSection)

					// Auto-expand parent sections
					if (collapsible) {
						const newOpenSections = new Set(openSections)
						sections.forEach((section) => {
							if (
								section.subsections?.some(
									(sub) => sub.id === mostVisibleSection
								)
							) {
								newOpenSections.add(section.id)
							}
						})
						setOpenSections(newOpenSections)
					}
				}
			},
			{
				// Adjust the root margin to start detecting slightly before the section enters the viewport
				rootMargin: '-10% 0px -85% 0px',
				// Use multiple thresholds for more granular visibility detection
				threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0]
			}
		)

		// Helper function to recursively get all section IDs
		const getAllSectionIds = (sections: GuideSection[]): string[] => {
			return sections.reduce((acc: string[], section) => {
				acc.push(section.id)
				if (section.subsections?.length) {
					acc.push(...getAllSectionIds(section.subsections))
				}
				return acc
			}, [])
		}

		// Observe all sections and subsections
		const allSectionIds = getAllSectionIds(sections)
		allSectionIds.forEach((id) => {
			const element = document.getElementById(id)
			if (element) {
				observer.observe(element)
			}
		})

		return () => {
			observer.disconnect()
			visibleSections.clear()
		}
	}, [sections, collapsible, openSections])

	const scrollToSection = (sectionId: string) => {
		const element = document.getElementById(sectionId)
		if (element) {
			element.scrollIntoView({ behavior: 'smooth' })
			setActiveSection(sectionId)
		}
	}

	const toggleSection = (sectionId: string) => {
		const newOpenSections = new Set(openSections)
		if (newOpenSections.has(sectionId)) {
			newOpenSections.delete(sectionId)
		} else {
			newOpenSections.add(sectionId)
		}
		setOpenSections(newOpenSections)
	}

	const renderSection = (section: GuideSection, depth = 0) => {
		const hasSubsections = section.subsections?.length > 0
		const isOpen = openSections.has(section.id)
		const isActive = activeSection === section.id

		if (hasSubsections && collapsible) {
			return (
				<Collapsible
					key={section.id}
					open={isOpen}
					onOpenChange={() => toggleSection(section.id)}
				>
					<CollapsibleTrigger className="w-full">
						<div
							className={cn(
								'flex items-center gap-2 px-4 py-2 text-sm rounded-md transition-colors',
								'hover:bg-neutral-800/50',
								isActive
									? 'bg-neutral-800/75 text-white font-medium'
									: 'text-neutral-400'
							)}
						>
							<ChevronRight
								className={cn(
									'h-4 w-4 transition-transform',
									isOpen && 'transform rotate-90'
								)}
							/>
							{section.icon && (
								<section.icon className="h-4 w-4" />
							)}
							{section.label}
						</div>
					</CollapsibleTrigger>
					<CollapsibleContent>
						<div className="ml-4 border-l border-neutral-800">
							{section.subsections.map((subsection) =>
								renderSection(subsection, depth + 1)
							)}
						</div>
					</CollapsibleContent>
				</Collapsible>
			)
		}

		return (
			<button
				key={section.id}
				onClick={() => scrollToSection(section.id)}
				className={cn(
					'w-full flex items-center gap-2 text-left px-4 py-2 text-sm rounded-md transition-colors',
					'hover:bg-neutral-800/50',
					isActive
						? 'bg-neutral-800/75 text-white font-medium'
						: 'text-neutral-400',
					depth > 0 && 'text-sm'
				)}
			>
				{section.icon && <section.icon className="h-4 w-4" />}
				{section.label}
			</button>
		)
	}

	return (
		<nav
			className={cn(
				'sticky top-20 max-h-[calc(100vh-5rem)] overflow-y-auto',
				'scrollbar-thin scrollbar-thumb-neutral-800 scrollbar-track-transparent',
				className
			)}
		>
			<ul className="space-y-1 py-4">
				{sections.map((section) => (
					<li key={section.id}>{renderSection(section)}</li>
				))}
			</ul>
		</nav>
	)
}
