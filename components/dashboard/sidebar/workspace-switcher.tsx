'use client'

import * as React from 'react'
import { ChevronsUpDown, Plus, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar,
} from '@/components/dashboard/sidebar/sidebar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { getUserWorkspaces } from '@/modules/workspaces/api/queries'
import { createWorkspace } from '@/modules/workspaces/api/mutations'
import { useToast } from '@/hooks/use-toast'
import { WorkspaceSwitcherLoader } from '@/components/loaders/workspace-switcher.loader'
type Workspace = {
	id: string
	name: string
	slug: string
	description: string | null
	logo: string | null
	createdAt: Date
	role: string
	isActive: boolean
}

export function WorkspaceSwitcher() {
	const { isMobile } = useSidebar()
	const router = useRouter()
	const { toast } = useToast()
	const [isLoading, setIsLoading] = React.useState(true)
	const [workspaces, setWorkspaces] = React.useState<Workspace[]>([])
	const [activeWorkspace, setActiveWorkspace] =
		React.useState<Workspace | null>(null)
	const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false)
	const [isCreating, setIsCreating] = React.useState(false)
	const [user, setUser] = React.useState<{ id: string } | null>(null)

	// Fetch workspaces on component mount
	React.useEffect(() => {
		const fetchData = async () => {
			try {
				setIsLoading(true)
				const userData = (window as any).__user || null
				setUser(userData)

				const workspacesData = await getUserWorkspaces()
				setWorkspaces(workspacesData)

				// Set active workspace to the first one or null if none exist
				if (workspacesData.length > 0) {
					setActiveWorkspace(workspacesData[0])
				}
			} catch (error) {
				console.error('Error fetching workspaces:', error)
				toast({
					title: 'Error',
					description: 'Failed to load workspaces',
					variant: 'destructive',
				})
			} finally {
				setIsLoading(false)
			}
		}

		fetchData()
	}, [toast])

	const handleCreateWorkspace = async (
		e: React.FormEvent<HTMLFormElement>
	) => {
		e.preventDefault()
		if (!user) return

		try {
			setIsCreating(true)
			const formData = new FormData(e.currentTarget)
			const result = await createWorkspace(user.id, formData)

			if (result.error) {
				toast({
					title: 'Error',
					description: result.error,
					variant: 'destructive',
				})
				return
			}

			if (result.success) {
				toast({
					title: 'Success',
					description: 'Workspace created successfully',
				})

				// Refresh workspaces list
				const workspacesData = await getUserWorkspaces()
				setWorkspaces(workspacesData)

				// Set the new workspace as active
				const newWorkspace = workspacesData.find(
					(w) => w.id === result.workspaceId
				)
				if (newWorkspace) {
					setActiveWorkspace(newWorkspace)
				}

				setIsCreateModalOpen(false)

				// Navigate to the new workspace
				if (result.slug) {
					router.push(`/dashboard/workspaces/${result.slug}`)
				}
			}
		} catch (error) {
			console.error('Error creating workspace:', error)
			toast({
				title: 'Error',
				description: 'Failed to create workspace',
				variant: 'destructive',
			})
		} finally {
			setIsCreating(false)
		}
	}

	const handleWorkspaceSelect = (workspace: Workspace) => {
		setActiveWorkspace(workspace)
		router.push(`/dashboard/workspaces/${workspace.slug}`)
	}

	// Placeholder icon for workspaces without a logo
	const WorkspaceIcon = () => (
		<div className="flex items-center justify-center size-full font-semibold text-xs">
			{activeWorkspace?.name.charAt(0) || 'W'}
		</div>
	)

	if (isLoading) {
		return <WorkspaceSwitcherLoader />
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
									<WorkspaceIcon />
								</div>
								<div className="grid flex-1 text-left text-sm leading-tight">
									<span className="truncate font-semibold">
										{activeWorkspace?.name ||
											'Select Workspace'}
									</span>
									<span className="truncate text-xs">
										{activeWorkspace?.role ||
											'No workspaces'}
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
							{workspaces.length > 0 ? (
								workspaces.map((workspace, index) => (
									<DropdownMenuItem
										key={workspace.id}
										onClick={() =>
											handleWorkspaceSelect(workspace)
										}
										className="gap-2 p-2"
									>
										<div className="flex size-6 items-center justify-center rounded-sm border bg-sidebar-primary text-sidebar-primary-foreground">
											{workspace.name.charAt(0)}
										</div>
										<span className="flex-1 truncate">
											{workspace.name}
										</span>
										{workspace.role === 'owner' && (
											<span className="text-xs text-muted-foreground">
												Owner
											</span>
										)}
									</DropdownMenuItem>
								))
							) : (
								<div className="px-2 py-4 text-center text-sm text-muted-foreground">
									No workspaces found
								</div>
							)}
							<DropdownMenuSeparator />
							<DropdownMenuItem
								onClick={() => setIsCreateModalOpen(true)}
								className="gap-2 p-2 cursor-pointer"
							>
								<div className="flex size-6 items-center justify-center rounded-md border bg-background">
									<Plus className="size-4" />
								</div>
								<div className="font-medium">
									Create workspace
								</div>
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</SidebarMenuItem>
			</SidebarMenu>

			<Dialog
				open={isCreateModalOpen}
				onOpenChange={setIsCreateModalOpen}
			>
				<DialogContent className="sm:max-w-[425px]">
					<DialogHeader>
						<DialogTitle>Create new workspace</DialogTitle>
						<DialogDescription>
							Create a new workspace for your team to collaborate
							on projects.
						</DialogDescription>
					</DialogHeader>
					<form onSubmit={handleCreateWorkspace}>
						<div className="grid gap-4 py-4">
							<div className="grid gap-2">
								<label
									htmlFor="name"
									className="text-sm font-medium"
								>
									Workspace Name
								</label>
								<Input
									id="name"
									name="name"
									placeholder="Acme Inc."
									required
									autoComplete="off"
								/>
							</div>
							<div className="grid gap-2">
								<label
									htmlFor="description"
									className="text-sm font-medium"
								>
									Description
								</label>
								<Textarea
									id="description"
									name="description"
									placeholder="A brief description of your workspace"
									rows={3}
								/>
							</div>
						</div>
						<DialogFooter>
							<Button
								type="button"
								variant="outline"
								onClick={() => setIsCreateModalOpen(false)}
								disabled={isCreating}
							>
								Cancel
							</Button>
							<Button
								type="submit"
								disabled={isCreating}
							>
								{isCreating && (
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								)}
								Create Workspace
							</Button>
						</DialogFooter>
					</form>
				</DialogContent>
			</Dialog>
		</>
	)
}
