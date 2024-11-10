

import { cn } from '@/lib/utils'
import { ChevronRight, Menu } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Collapsible, CollapsibleContent, CollapsibleTrigger, Sheet, SheetContent, SheetTrigger } from 'ui'
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
	const [activeSections, setActiveSections] = useState<Set<string>>(new Set([sections[0]?.id]))
	const [openSections, setOpenSections] = useState<Set<string>>(new Set(defaultOpenSections))
	const [lastActivated, setLastActivated] = useState<{id: string, time: number}>()
	const DEBOUNCE_TIME = 2000

	useEffect(() => {
		const visibleSections = new Map<string, number>()

		const observer = new IntersectionObserver(
			(entries) => {
				const newActiveSections = new Set<string>()
				const newOpenSections = new Set(openSections)
				const now = Date.now()

				const entriesByParent = new Map<string, IntersectionObserverEntry[]>()
				
				entries.forEach((entry) => {
					const sectionId = entry.target.id
					const parentSection = sections.find(section => 
						section.subsections?.some(sub => sub.id === sectionId)
					)
					
					if (parentSection) {
						if (!entriesByParent.has(parentSection.id)) {
							entriesByParent.set(parentSection.id, [])
						}
						entriesByParent.get(parentSection.id)?.push(entry)
					} else {
						if (entry.isIntersecting) {
							const shouldActivate = !lastActivated || 
								lastActivated.id !== entry.target.id || 
								(now - lastActivated.time) > DEBOUNCE_TIME

							if (shouldActivate) {
								newActiveSections.add(entry.target.id)
								setLastActivated({ id: entry.target.id, time: now })
							}
						}
					}
				})

				entriesByParent.forEach((parentEntries, parentId) => {
					const visibleSubsections = parentEntries
						.filter(entry => entry.isIntersecting)
						.sort((a, b) => b.boundingClientRect.top - a.boundingClientRect.top)

					if (visibleSubsections.length > 0) {
						newActiveSections.add(parentId)
						newActiveSections.add(visibleSubsections[0].target.id)
						newOpenSections.add(parentId)
					}
				})

				if (newActiveSections.size === 0 && window.scrollY < 100) {
					newActiveSections.add(sections[0]?.id)
				}

				setActiveSections(newActiveSections)
				setOpenSections(newOpenSections)
			},
			{
				rootMargin: '-10% 0px -10% 0px',
				threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0]
			}
		)

		const getAllSectionIds = (sections: GuideSection[]): string[] => {
			return sections.reduce((acc: string[], section) => {
				acc.push(section.id)
				if (section.subsections?.length) {
					acc.push(...getAllSectionIds(section.subsections))
				}
				return acc
			}, [])
		}

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
	}, [sections, lastActivated])

	const scrollToSection = (sectionId: string) => {
		const element = document.getElementById(sectionId)
		if (element) {
			element.scrollIntoView({ behavior: 'smooth' })
			setActiveSections(new Set([sectionId]))
			
			const newOpenSections = new Set(openSections)
			sections.forEach((section) => {
				if (section.id === sectionId || 
					section.subsections?.some(sub => sub.id === sectionId)) {
					newOpenSections.add(section.id)
				}
			})
			setOpenSections(newOpenSections)
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
		const isActive = activeSections.has(section.id)
		const otherSectionsActive = activeSections.size > 0 && !isActive

		const getBackgroundOpacity = (depth: number) => {
			const baseOpacity = 0.75
			const increase = 0.05
			return Math.min(baseOpacity + (depth * increase), 0.95)
		}

		const activeStyles = isActive ? {
			background: `bg-neutral-800/${Math.round(getBackgroundOpacity(depth) * 100)}`,
			border: 'border-l-2 border-purple-500',
			text: 'text-white font-medium',
			shadow: 'shadow-[0_0_15px_rgba(168,85,247,0.15)]'
		} : otherSectionsActive ? {
			background: '',
			border: 'border-l-2 border-transparent',
			text: 'text-neutral-500',
			shadow: ''
		} : {
			background: '',
			border: 'border-l-2 border-transparent',
			text: 'text-neutral-400',
			shadow: ''
		}

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
								'flex items-center gap-2 px-4 py-3 text-sm rounded-md',
								'hover:bg-neutral-800/50',
								'transition-all duration-300 ease-in-out my-0.5',
								activeStyles.background,
								activeStyles.border,
								activeStyles.text,
								activeStyles.shadow
							)}
						>
							<ChevronRight
								className={cn(
									'h-4 w-4 transition-transform duration-300',
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
						<div className="ml-4 border-l border-neutral-800 my-1">
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
					'w-full flex items-center gap-2 text-left px-4 py-3 text-sm rounded-md',
					'hover:bg-neutral-800/50',
					'transition-all duration-300 ease-in-out my-0.5',
					activeStyles.background,
					activeStyles.border,
					activeStyles.text,
					activeStyles.shadow,
					depth > 0 && 'text-sm'
				)}
			>
				{section.icon && <section.icon className="h-4 w-4" />}
				{section.label}
			</button>
		)
	}

	const SidebarContent = () => (
		<nav
			className={cn(
				'max-h-[calc(100vh-5rem)] overflow-y-auto',
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

	return (
		<>
			{/* Desktop Sidebar */}
			<div className="hidden lg:block sticky top-20">
				<SidebarContent />
			</div>

			{/* Mobile Floating Button & Sheet */}
			<div className="lg:hidden fixed bottom-4 right-4 z-50">
				<Sheet>
					<SheetTrigger asChild>
						<button className="p-3 rounded-full bg-purple-500 text-white shadow-lg hover:bg-purple-600 transition-colors">
							<Menu className="h-6 w-6" />
						</button>
					</SheetTrigger>
					<SheetContent side="left" className="w-80 p-0">
						<div className="h-full bg-neutral-900/95 backdrop-blur-sm">
							<SidebarContent />
						</div>
					</SheetContent>
				</Sheet>
			</div>
		</>
	)
}
