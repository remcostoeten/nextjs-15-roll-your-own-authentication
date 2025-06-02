'use client';

import { ChevronsUpDown, Plus } from 'lucide-react';
import { useState, useTransition } from 'react';

import { useWorkspace } from '@/modules/workspaces/hooks/use-workspace';
import { createWorkspace } from '@/modules/workspaces/server/mutations/create-workspace';
import { TWorkspaceWithOwner } from '@/modules/workspaces/types';
import { toast } from '@/shared/components/toast';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from '@/shared/components/ui/dialog';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuShortcut,
	DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import {
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar,
} from '@/shared/components/ui/sidebar';
import { Button } from 'ui';

/**
 * Displays a workspace switcher menu and dialog for creating new workspaces within the sidebar.
 *
 * Allows users to view, switch between, and create workspaces. Presents a dropdown menu listing all available workspaces and provides a modal dialog for creating a new workspace with a name, emoji, and optional description. Notifies users of success or failure during workspace creation.
 *
 * @param workspaces - The list of available workspaces to display in the switcher menu.
 *
 * @returns The sidebar workspace switcher UI, or `null` if no current workspace is set.
 */
export function WorkspaceSwitcher({
	workspaces,
}: {
	workspaces: TWorkspaceWithOwner[];
}) {
	const { isMobile } = useSidebar();
	const { currentWorkspace, switchWorkspace, refreshWorkspaces } = useWorkspace();
	const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
	const [isPending, startTransition] = useTransition();
	const [formData, setFormData] = useState({
		title: '',
		emoji: '🏢',
		description: '',
	});

	const handleCreateWorkspace = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!formData.title.trim()) {
			toast.error('Workspace title is required');
			return;
		}

		startTransition(async () => {
			try {
				const formDataObj = new FormData();
				formDataObj.append('title', formData.title.trim());
				formDataObj.append('emoji', formData.emoji.trim());
				formDataObj.append('description', formData.description.trim());

				const result = await createWorkspace(formDataObj);

				if (result.success && result.data) {
					await refreshWorkspaces();
					switchWorkspace(result.data);
					toast.success('Workspace created successfully!');
					setIsCreateDialogOpen(false);
					setFormData({ title: '', emoji: '🏢', description: '' });
				} else {
					toast.error(result.error || 'Failed to create workspace');
				}
			} catch (error) {
				toast.error('Failed to create workspace');
			}
		});
	};

	if (!currentWorkspace) {
		return null;
	}

	return (
		<>
			<SidebarMenu>
				<SidebarMenuItem>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<SidebarMenuButton
								size="lg"
								className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
							>
								<div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
									<span className="text-lg">{currentWorkspace.emoji}</span>
								</div>
								<div className="grid flex-1 text-left text-sm leading-tight">
									<span className="truncate font-semibold">
										{currentWorkspace.title}
									</span>
									<span className="truncate text-xs">
										{currentWorkspace.memberCount} members
									</span>
								</div>
								<ChevronsUpDown className="ml-auto" />
							</SidebarMenuButton>
						</DropdownMenuTrigger>
						<DropdownMenuContent
							className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
							align="start"
							side={isMobile ? 'bottom' : 'right'}
							sideOffset={4}
						>
							<DropdownMenuLabel className="text-xs text-muted-foreground">
								Workspaces
							</DropdownMenuLabel>
							{workspaces.map((workspace, index) => (
								<DropdownMenuItem
									key={workspace.id}
									onClick={() => switchWorkspace(workspace)}
									className="gap-2 p-2"
								>
									<div className="flex size-6 items-center justify-center rounded-sm border">
										<span className="text-sm">{workspace.emoji}</span>
									</div>
									<div className="flex flex-col">
										<span className="text-sm font-medium">
											{workspace.title}
										</span>
										<span className="text-xs text-muted-foreground">
											{workspace.memberCount} members
										</span>
									</div>
									<DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
								</DropdownMenuItem>
							))}
							<DropdownMenuSeparator />
							<DropdownMenuItem
								className="gap-2 p-2"
								onClick={() => setIsCreateDialogOpen(true)}
							>
								<div className="flex size-6 items-center justify-center rounded-md border bg-background">
									<Plus className="size-4" />
								</div>
								<div className="font-medium text-muted-foreground">
									Add workspace
								</div>
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</SidebarMenuItem>
			</SidebarMenu>

			<Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
				<DialogContent className="sm:max-w-[425px]">
					<DialogHeader>
						<DialogTitle>Create New Workspace</DialogTitle>
						<DialogDescription>
							Create a new workspace to organize your projects and collaborate with
							your team.
						</DialogDescription>
					</DialogHeader>
					<form onSubmit={handleCreateWorkspace} className="space-y-4">
						<div className="space-y-2">
							<label htmlFor="emoji" className="text-sm font-medium">
								Emoji
							</label>
							<input
								id="emoji"
								type="text"
								value={formData.emoji}
								onChange={(e) =>
									setFormData((prev) => ({ ...prev, emoji: e.target.value }))
								}
								placeholder="🏢"
								maxLength={2}
								className="w-16 px-3 py-2 border border-input bg-background rounded-md text-center"
							/>
						</div>
						<div className="space-y-2">
							<label htmlFor="title" className="text-sm font-medium">
								Workspace Name
							</label>
							<input
								id="title"
								type="text"
								value={formData.title}
								onChange={(e) =>
									setFormData((prev) => ({ ...prev, title: e.target.value }))
								}
								placeholder="My Awesome Workspace"
								required
								className="w-full px-3 py-2 border border-input bg-background rounded-md"
							/>
						</div>
						<div className="space-y-2">
							<label htmlFor="description" className="text-sm font-medium">
								Description (optional)
							</label>
							<textarea
								id="description"
								value={formData.description}
								onChange={(e) =>
									setFormData((prev) => ({
										...prev,
										description: e.target.value,
									}))
								}
								placeholder="What's this workspace for?"
								rows={3}
								className="w-full px-3 py-2 border border-input bg-background rounded-md resize-none"
							/>
						</div>
						<div className="flex justify-end space-x-2">
							<Button
								type="button"
								variant="outline"
								onClick={() => setIsCreateDialogOpen(false)}
							>
								Cancel
							</Button>
							<Button type="submit" disabled={isPending || !formData.title.trim()}>
								{isPending ? 'Creating...' : 'Create Workspace'}
							</Button>
						</div>
					</form>
				</DialogContent>
			</Dialog>
		</>
	);
}
