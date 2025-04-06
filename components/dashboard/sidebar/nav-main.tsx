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
		if (url === '/dashboard' && pathname === '/dashboard') {
			return true
		}
		return pathname.startsWith(url) && url !== '/dashboard'
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
									<SidebarMenuButton tooltip={item.title}>
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
