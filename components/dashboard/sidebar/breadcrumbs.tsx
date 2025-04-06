'use client'

import { ChevronRight } from 'lucide-react'
import Link from 'next/link'
import {
	SidebarTrigger,
	useSidebar,
} from '@/components/dashboard/sidebar/sidebar'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'

interface BreadcrumbItem {
	title: string
	href: string
	active?: boolean
}

interface BreadcrumbNavProps {
	items: BreadcrumbItem[]
	className?: string
}

export function BreadcrumbNav({ items, className }: BreadcrumbNavProps) {
	return (
		<header
			className={cn(
				'flex h-16 shrink-0 items-center gap-2 border-b border-neutral-800 px-4 transition-all duration-300',
				className
			)}
		>
			<div className="flex items-center gap-2">
				<SidebarTrigger className="-ml-1" />
				<Separator
					orientation="vertical"
					className="mr-2 h-4"
				/>

				<nav className="flex items-center">
					<ol className="flex items-center gap-1">
						{items.map((item, index) => (
							<li
								key={index}
								className="flex items-center"
							>
								{index > 0 && (
									<ChevronRight className="mx-1 h-4 w-4 text-neutral-500" />
								)}
								{item.active ? (
									<span className="text-sm font-medium">
										{item.title}
									</span>
								) : (
									<Link
										href={item.href}
										className="text-sm font-medium text-neutral-400 hover:text-white transition-colors"
									>
										{item.title}
									</Link>
								)}
							</li>
						))}
					</ol>
				</nav>
			</div>
		</header>
	)
}
