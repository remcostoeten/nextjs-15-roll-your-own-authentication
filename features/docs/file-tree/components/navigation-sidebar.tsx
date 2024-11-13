'use client'

import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger
} from '@/components/ui/accordion'
import { ScrollArea } from '@/components/ui/scroll-area'
import * as Icons from '@/features/docs/components/Icons'
import { cn } from 'helpers'
import { useState } from 'react'
import SECTIONS from '../../config/file-tree-sections.ts/sections'

export function NavigationSidebar() {
	const [activeSection, setActiveSection] = useState<string>('')

	return (
		<aside className="w-64 border-r border-zinc-800 h-screen">
			<ScrollArea className="h-full">
				<div className="p-4 space-y-6">
					{/* Header */}
					<div className="flex items-center space-x-2">
						<Icons.FileTree className="w-6 h-6 text-blue-500" />
						<div>
							<h1 className="font-semibold">FileTree</h1>
							<p className="text-xs text-zinc-400">
								Documentation
							</p>
						</div>
					</div>

					{/* Navigation */}
					<nav className="space-y-1">
						{SECTIONS.map((section) => (
							<Accordion
								key={section.id}
								type="single"
								collapsible
								defaultValue={
									activeSection === section.id
										? section.id
										: undefined
								}
							>
								<AccordionItem
									value={section.id}
									className="border-none"
								>
									<AccordionTrigger
										className={cn(
											'py-2 px-3 text-sm rounded-md hover:bg-zinc-800/50',
											activeSection === section.id &&
												'bg-zinc-800/50'
										)}
									>
										{section.title}
									</AccordionTrigger>
									<AccordionContent>
										<div className="pl-4 py-1 space-y-1">
											{section.subsections.map(
												(subsection) => (
													<a
														key={subsection.id}
														href={`#${subsection.id}`}
														className={cn(
															'block py-1 px-3 text-sm rounded-md text-zinc-400',
															'hover:text-zinc-100 hover:bg-zinc-800/50',
															'transition-colors duration-200'
														)}
														onClick={() =>
															setActiveSection(
																section.id
															)
														}
													>
														{subsection.title}
													</a>
												)
											)}
										</div>
									</AccordionContent>
								</AccordionItem>
							</Accordion>
						))}
					</nav>
				</div>
			</ScrollArea>
		</aside>
	)
}
