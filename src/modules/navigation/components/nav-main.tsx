'use client';

import { For } from '@/shared/components/core/for';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/shared/components/ui/collapsible';
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from '@/shared/components/ui/sidebar';
import { ChevronRight, type LucideIcon } from 'lucide-react';
import Link from 'next/link';

type NavItem = {
	title: string;
	url: string;
	icon?: LucideIcon;
	isActive?: boolean;
	items?: {
		title: string;
		url: string;
	}[];
};

export function NavMain({ items }: { items: NavItem[] }) {
	return (
		<SidebarGroup>
			<SidebarGroupLabel>Platform</SidebarGroupLabel>
			<SidebarMenu>
				<For each={items}>
					{(item) =>
						item.items ? (
							<Collapsible
								key={item.title}
								asChild
								defaultOpen={item.isActive}
								className="group/collapsible"
							>
								<SidebarMenuItem>
									<CollapsibleTrigger asChild>
										<SidebarMenuButton tooltip={item.title}>
											{item.icon && <item.icon />}
											<span>{item.title}</span>
											<ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
										</SidebarMenuButton>
									</CollapsibleTrigger>
									<CollapsibleContent>
										<SidebarMenuSub>
											<For each={item.items}>
												{(subItem) => (
													<SidebarMenuSubItem key={subItem.title}>
														<SidebarMenuSubButton asChild>
															<Link href={subItem.url}>
																<span>{subItem.title}</span>
															</Link>
														</SidebarMenuSubButton>
													</SidebarMenuSubItem>
												)}
											</For>
										</SidebarMenuSub>
									</CollapsibleContent>
								</SidebarMenuItem>
							</Collapsible>
						) : (
							<SidebarMenuItem key={item.title}>
								<SidebarMenuButton asChild>
									<Link href={item.url}>
										{item.icon && <item.icon />}
										<span>{item.title}</span>
									</Link>
								</SidebarMenuButton>
							</SidebarMenuItem>
						)
					}
				</For>
			</SidebarMenu>
		</SidebarGroup>
	);
}
