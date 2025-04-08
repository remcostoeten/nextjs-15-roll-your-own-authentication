'use client'

import type React from 'react'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
	Check,
	ChevronsUpDown,
	PlusCircle,
	Briefcase,
	Loader2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
	CommandSeparator,
} from '@/components/ui/command'
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { getUserWorkspaces } from '@/modules/workspaces/api/queries'
import { createWorkspace } from '@/modules/workspaces/api/mutations'
import { useToast } from '@/hooks/use-toast'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

export type Workspace = {
	id: string
	name: string
	slug: string
	description: string | null
	logo: string | null
	role: string
	isActive: boolean
}

interface WorkspaceSwitcherProps {
	currentWorkspace?: Workspace | null
}

export function WorkspaceSwitcher({
	currentWorkspace,
}: WorkspaceSwitcherProps) {
	const router = useRouter()
	const { toast } = useToast()
	const [open, setOpen] = useState(false)
	const [showNewWorkspaceDialog, setShowNewWorkspaceDialog] = useState(false)
	const [workspaces, setWorkspaces] = useState<Workspace[]>([])
	const [isLoading, setIsLoading] = useState(true)
	const [isCreating, setIsCreating] = useState(false)

	// Fetch workspaces
	useEffect(() => {
		const fetchWorkspaces = async () => {
			setIsLoading(true)
			try {
				const data = await getUserWorkspaces()
				setWorkspaces(data)
			} catch (error) {
				console.error('Error fetching workspaces:', error)
			} finally {
				setIsLoading(false)
			}
		}

		fetchWorkspaces()
	}, [])

	const handleSelectWorkspace = (workspace: Workspace) => {
		router.push(`/dashboard/workspaces/${workspace.slug}`)
		setOpen(false)
	}

	const handleCreateWorkspace = async (
		e: React.FormEvent<HTMLFormElement>
	) => {
		e.preventDefault()
		setIsCreating(true)

		const formData = new FormData(e.currentTarget)

		try {
			const result = await createWorkspace(formData)

			if (result.error) {
				toast({
					variant: 'destructive',
					title: 'Failed to create workspace',
					description: result.error,
				})
			} else {
				toast({
					title: 'Workspace created',
					description:
						'Your workspace has been created successfully.',
				})
				setShowNewWorkspaceDialog(false)
				router.push(`/dashboard/workspaces/${result.slug}`)
			}
		} catch (error) {
			toast({
				variant: 'destructive',
				title: 'Something went wrong',
				description: 'Please try again later.',
			})
		} finally {
			setIsCreating(false)
		}
	}

	// Get workspace initials for avatar
	const getWorkspaceInitials = (name: string) => {
		return name
			.split(' ')
			.map((n) => n[0])
			.join('')
			.toUpperCase()
			.substring(0, 2)
	}

	return (
		<>
			<Popover
				open={open}
				onOpenChange={setOpen}
			>
				<PopoverTrigger asChild>
					<Button
						variant="outline"
						role="combobox"
						aria-expanded={open}
						aria-label="Select a workspace"
						className="w-[220px] justify-between"
					>
						{currentWorkspace ? (
							<>
								<div className="flex items-center">
									<Avatar className="h-6 w-6 mr-2">
										{currentWorkspace.logo ? (
											<img
												src={
													currentWorkspace.logo ||
													'/placeholder.svg'
												}
												alt={currentWorkspace.name}
											/>
										) : (
											<AvatarFallback className="bg-primary text-primary-foreground text-xs">
												{getWorkspaceInitials(
													currentWorkspace.name
												)}
											</AvatarFallback>
										)}
									</Avatar>
									<span className="truncate">
										{currentWorkspace.name}
									</span>
								</div>
							</>
						) : (
							<>
								<Briefcase className="mr-2 h-4 w-4" />
								<span>Select workspace</span>
							</>
						)}
						<ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
					</Button>
				</PopoverTrigger>
				<PopoverContent className="w-[220px] p-0">
					<Command>
						<CommandList>
							<CommandInput placeholder="Search workspace..." />
							<CommandEmpty>
								{isLoading
									? 'Loading...'
									: 'No workspace found.'}
							</CommandEmpty>
							{workspaces.length > 0 ? (
								<CommandGroup heading="Workspaces">
									{workspaces.map((workspace) => (
										<CommandItem
											key={workspace.id}
											onSelect={() =>
												handleSelectWorkspace(workspace)
											}
											className="text-sm flex items-center"
										>
											<Avatar className="h-5 w-5 mr-2">
												{workspace.logo ? (
													<img
														src={
															workspace.logo ||
															'/placeholder.svg'
														}
														alt={workspace.name}
													/>
												) : (
													<AvatarFallback className="bg-primary text-primary-foreground text-xs">
														{getWorkspaceInitials(
															workspace.name
														)}
													</AvatarFallback>
												)}
											</Avatar>
											<span className="truncate flex-1">
												{workspace.name}
											</span>
											{currentWorkspace?.id ===
												workspace.id && (
												<Check className="ml-auto h-4 w-4" />
											)}
										</CommandItem>
									))}
								</CommandGroup>
							) : (
								!isLoading && (
									<div className="py-6 text-center text-sm">
										No workspaces found
									</div>
								)
							)}
						</CommandList>
						<CommandSeparator />
						<CommandList>
							<CommandGroup>
								<CommandItem
									onSelect={() => {
										setOpen(false)
										setShowNewWorkspaceDialog(true)
									}}
								>
									<PlusCircle className="mr-2 h-4 w-4" />
									Create Workspace
								</CommandItem>
							</CommandGroup>
						</CommandList>
					</Command>
				</PopoverContent>
			</Popover>

			<Dialog
				open={showNewWorkspaceDialog}
				onOpenChange={setShowNewWorkspaceDialog}
			>
				<DialogContent>
					<form onSubmit={handleCreateWorkspace}>
						<DialogHeader>
							<DialogTitle>Create workspace</DialogTitle>
							<DialogDescription>
								Add a new workspace to organize your projects
								and tasks.
							</DialogDescription>
						</DialogHeader>
						<div className="space-y-4 py-4">
							<div className="space-y-2">
								<Label htmlFor="name">Name</Label>
								<Input
									id="name"
									name="name"
									placeholder="Acme Inc."
									required
									disabled={isCreating}
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="description">
									Description (Optional)
								</Label>
								<Textarea
									id="description"
									name="description"
									placeholder="Team workspace for Acme Inc."
									disabled={isCreating}
								/>
							</div>
						</div>
						<DialogFooter>
							<Button
								type="button"
								variant="outline"
								onClick={() => setShowNewWorkspaceDialog(false)}
								disabled={isCreating}
							>
								Cancel
							</Button>
							<Button
								type="submit"
								disabled={isCreating}
							>
								{isCreating ? (
									<>
										<Loader2 className="mr-2 h-4 w-4 animate-spin" />
										Creating...
									</>
								) : (
									'Create Workspace'
								)}
							</Button>
						</DialogFooter>
					</form>
				</DialogContent>
			</Dialog>
		</>
	)
}
