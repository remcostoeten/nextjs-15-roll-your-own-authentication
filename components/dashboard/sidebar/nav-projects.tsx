'use client'

import {
	Folder,
	Forward,
	MoreHorizontal,
	Trash2,
	type LucideIcon,
	Plus,
} from 'lucide-react'

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
	SidebarGroup,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuAction,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar,
} from '@/components/dashboard/sidebar/sidebar'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export function NavProjects({
	projects,
}: {
	projects: {
		name: string
		url: string
		icon: LucideIcon
	}[]
}) {
	const { isMobile } = useSidebar()

	return (
		<SidebarGroup className="group-data-[collapsible=icon]:hidden">
			<SidebarGroupLabel>Workspaces</SidebarGroupLabel>
			<SidebarMenu>
				{projects.map((item) => (
					<SidebarMenuItem key={item.name}>
						<SidebarMenuButton asChild>
							<a href={item.url}>
								<item.icon />
								<span>{item.name}</span>
							</a>
						</SidebarMenuButton>
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<SidebarMenuAction showOnHover>
									<MoreHorizontal />
									<span className="sr-only">More</span>
								</SidebarMenuAction>
							</DropdownMenuTrigger>
							<DropdownMenuContent
								className="w-48 rounded-lg"
								side={isMobile ? 'bottom' : 'right'}
								align={isMobile ? 'end' : 'start'}
							>
								<DropdownMenuItem>
									<Folder className="mr-2 h-4 w-4 text-muted-foreground" />
									<span>View Workspace</span>
								</DropdownMenuItem>
								<DropdownMenuItem>
									<Forward className="mr-2 h-4 w-4 text-muted-foreground" />
									<span>Share Workspace</span>
								</DropdownMenuItem>
								<DropdownMenuSeparator />
								<DropdownMenuItem>
									<Trash2 className="mr-2 h-4 w-4 text-muted-foreground" />
									<span>Delete Workspace</span>
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</SidebarMenuItem>
				))}

				<SidebarMenuItem>
					<Dialog>
						<DialogTrigger asChild>
							<SidebarMenuButton className="text-sidebar-foreground/70">
								<Plus className="text-sidebar-foreground/70" />
								<span>New Workspace</span>
							</SidebarMenuButton>
						</DialogTrigger>
						<DialogContent>
							<DialogHeader>
								<DialogTitle>Create new workspace</DialogTitle>
								<DialogDescription>
									Add a new workspace to organize your
									projects.
								</DialogDescription>
							</DialogHeader>
							<div className="grid gap-4 py-4">
								<div className="grid gap-2">
									<Label htmlFor="name">Name</Label>
									<Input
										id="name"
										placeholder="Workspace name"
									/>
								</div>
								<div className="grid gap-2">
									<Label htmlFor="description">
										Description
									</Label>
									<Input
										id="description"
										placeholder="Workspace description"
									/>
								</div>
							</div>
							<DialogFooter>
								<Button type="submit">Create workspace</Button>
							</DialogFooter>
						</DialogContent>
					</Dialog>
				</SidebarMenuItem>
			</SidebarMenu>
		</SidebarGroup>
	)
}
