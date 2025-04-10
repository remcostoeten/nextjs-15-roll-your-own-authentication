'use client'

import type React from 'react'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/shared/helpers'
import { docsNavigation } from '@/core/config/docs-navigation'

interface DocsSidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function DocsSidebar({ className, ...props }: DocsSidebarProps) {
	const pathname = usePathname()

	const isActive = (href: string) => {
		if (href === '/docs' && pathname === '/docs') {
			return true
		}
		return pathname.startsWith(href) && href !== '/docs'
	}

	return (
		<div
			className={cn('pb-12', className)}
			{...props}
		>
			<div className="space-y-4 py-4">
				{docsNavigation.map((route) => (
					<div
						key={route.title}
						className="px-3 py-2"
					>
						<h4 className="mb-1 rounded-md px-2 py-1 text-sm font-medium">
							{route.title}
						</h4>
						{route.items?.length > 0 && (
							<div className="grid grid-flow-row auto-rows-max text-sm">
								{route.items.map((item) => (
									<Link
										key={item.href}
										href={item.disabled ? '#' : item.href}
										onClick={(e) => {
											if (item.disabled) {
												e.preventDefault()
											}
										}}
										className={cn(
											'group flex w-full items-center rounded-md border border-transparent px-2 py-1',
											item.disabled
												? 'cursor-not-allowed opacity-50'
												: 'hover:underline',
											isActive(item.href)
												? 'font-medium text-foreground bg-accent/80 hover:bg-accent'
												: 'text-muted-foreground hover:bg-accent/50'
										)}
									>
										{item.title}
										{/* {item.disabled && (
											<span className="ml-2 text-xs text-muted-foreground">
												(Coming soon)
											</span>
										)} */}
									</Link>
								))}
							</div>
						)}
					</div>
				))}
			</div>
		</div>
	)
}
