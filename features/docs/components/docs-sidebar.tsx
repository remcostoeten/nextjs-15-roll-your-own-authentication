'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger
} from '@/components/ui/tooltip'
import { ScrollArea } from '@/components/ui/scroll-area'

const sidebarItems = [
	{ title: 'Overview of Features', href: '/docs/overview' },
	{ title: 'Project Structure', href: '/docs/project-structure' },
	{ title: 'Usage Guide (API)', href: '/docs/usage-guide' },
	{ title: 'API Reference', href: '/docs/api-reference' },
	{ title: 'Environment Variables', href: '/docs/env-variables' },
	{ title: 'Hooks and Utility Functions', href: '/docs/hooks-and-utils' },
	{ title: 'SSR vs Client', href: '/docs/ssr-vs-client' },
	{ title: 'Roadmap', href: '/docs/roadmap' },
	{ title: 'Common Pitfalls', href: '/docs/pitfalls' }
]

export function DocsSidebar() {
	const pathname = usePathname()
	const [activeItem, setActiveItem] = useState('')

	useEffect(() => {
		const active = sidebarItems.find((item) =>
			pathname.startsWith(item.href)
		)
		if (active) {
			setActiveItem(active.href)
		}
	}, [pathname])

	return (
		<TooltipProvider>
			<aside className="w-64 bg-gray-50 border-r border-gray-200 h-[calc(100vh-4rem)] overflow-hidden">
				<ScrollArea className="h-full py-6 px-3">
					<nav>
						{sidebarItems.map((item) => (
							<Tooltip key={item.href}>
								<TooltipTrigger asChild>
									<Link
										href={item.href}
										className={`block py-2 px-4 my-1 rounded-md transition-colors ${
											activeItem === item.href
												? 'bg-gray-200 text-gray-900'
												: 'text-gray-600 hover:bg-gray-100'
										}`}
									>
										{item.title}
									</Link>
								</TooltipTrigger>
								<TooltipContent side="right">
									<p>{item.title}</p>
								</TooltipContent>
							</Tooltip>
						))}
					</nav>
				</ScrollArea>
			</aside>
		</TooltipProvider>
	)
}
