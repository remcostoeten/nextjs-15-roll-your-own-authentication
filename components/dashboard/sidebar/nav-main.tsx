'use client'

import { ChevronRight, type LucideIcon } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from '@/components/ui/collapsible'
import {
	SidebarGroup,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSub,
	SidebarMenuSubButton,
	SidebarMenuSubItem,
} from '@/components/dashboard/sidebar/sidebar'
import { Badge } from '@/components/ui/badge'

export function NavMain({
	items,
}: {
	items: {
		title: string
		url: string
		icon?: LucideIcon
		isActive?: boolean
		badge?: number
		items?: {
			title: string
			url: string
		}[]
	}[]
}) {
	const pathname = usePathname()

	const isActive = (url: string) => {
		// Exact match for root dashboard
		if (url === '/dashboard' && pathname === '/dashboard') {
			return true
		}

		// Special case for index routes
		if (url === '#') {
			return false
		}

		// For nested routes, check if the pathname starts with the url
		// This ensures parent items are highlighted when a child route is active
		// But only if the url is not just a fragment
		if (url !== '#' && pathname.startsWith(url)) {
			// For exact matches
			if (pathname === url) {
				return true
			}

			// For nested routes, ensure we're actually in a child route
			// This prevents partial URL matches from triggering
			const remainingPath = pathname.slice(url.length)
			return remainingPath.startsWith('/')
		}

		return false
	}

	return (
		<SidebarGroup>
			<SidebarGroupLabel>Platform</SidebarGroupLabel>
			<SidebarMenu>
				{items.map((item) =>
					item.items && item.items.length > 0 ? (
						<Collapsible
							key={item.title}
							asChild
							defaultOpen={item.isActive || isActive(item.url)}
							className="group/collapsible"
						>
							<SidebarMenuItem>
								<CollapsibleTrigger asChild>
									<SidebarMenuButton
										tooltip={item.title}
										isActive={isActive(item.url)}
										className="transition-colors duration-200 relative data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground data-[active=true]:font-medium before:absolute before:left-0 before:top-0 before:bottom-0 before:w-[2px] data-[active=true]:before:bg-emerald-500"
									>
										{item.icon && <item.icon />}
										<span className="flex items-center gap-2">
											{item.title}
											{item.badge !== undefined && (
												<Badge
													variant="secondary"
													className="ml-auto"
												>
													{item.badge}
												</Badge>
											)}
										</span>
										<ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
									</SidebarMenuButton>
								</CollapsibleTrigger>
								<CollapsibleContent>
									<SidebarMenuSub>
										{item.items?.map((subItem) => (
											<SidebarMenuSubItem
												key={subItem.title}
											>
												<SidebarMenuSubButton
													asChild
													isActive={isActive(
														subItem.url
													)}
													className="transition-colors duration-200 relative data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground data-[active=true]:font-medium before:absolute before:left-0 before:top-0 before:bottom-0 before:w-[2px] data-[active=true]:before:bg-emerald-500"
												>
													<Link href={subItem.url}>
														<span>
															{subItem.title}
														</span>
													</Link>
												</SidebarMenuSubButton>
											</SidebarMenuSubItem>
										))}
									</SidebarMenuSub>
								</CollapsibleContent>
							</SidebarMenuItem>
						</Collapsible>
					) : (
						<SidebarMenuItem key={item.title}>
							<SidebarMenuButton
								asChild
								isActive={isActive(item.url)}
								tooltip={item.title}
								className="transition-colors duration-200 relative data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground data-[active=true]:font-medium before:absolute before:left-0 before:top-0 before:bottom-0 before:w-[2px] data-[active=true]:before:bg-emerald-500"
							>
								<Link href={item.url}>
									{item.icon && <item.icon />}
									<span className="flex items-center gap-2">
										{item.title}
										{item.badge !== undefined && (
											<Badge
												variant="secondary"
												className="ml-auto"
											>
												{item.badge}
											</Badge>
										)}
									</span>
								</Link>
							</SidebarMenuButton>
						</SidebarMenuItem>
					)
				)}
			</SidebarMenu>
		</SidebarGroup>
	)
}
