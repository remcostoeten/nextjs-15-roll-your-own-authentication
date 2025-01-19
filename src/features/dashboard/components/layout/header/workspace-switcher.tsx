'use client'

import * as React from 'react'
import { Check, ChevronsUpDown, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/components/ui/popover'
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList, CommandInput, CommandSeparator } from '@/shared/components/ui/command'

type Workspace = {
	label: string
	value: string
}

const workspaces: Workspace[] = [
	{
		label: 'Personal Project',
		value: 'personal'
	},
	{
		label: 'Acme Corp',
		value: 'acme'
	},
	{
		label: 'Startup Project',
		value: 'startup'
	}
]

interface WorkspaceSwitcherProps {
	isCollapsed: boolean
}

export function WorkspaceSwitcher({ isCollapsed }: WorkspaceSwitcherProps) {
	const [open, setOpen] = React.useState(false)
	const [selectedWorkspace, setSelectedWorkspace] = React.useState<Workspace>(
		workspaces[0]
	)

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<button className="group relative flex h-10 w-full items-center px-2 mx-1 transition-colors duration-200 hover:text-emerald-400 hover:bg-emerald-500/5 text-emerald-400 bg-emerald-500/5">
					<span className="flex h-10 w-10 items-center justify-center">
						<div className="relative h-7 w-7 overflow-hidden rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-xs font-medium text-emerald-400/90 transition-all duration-200 group-hover:border-emerald-500/30">
							{selectedWorkspace.label.charAt(0)}
						</div>
					</span>
					<div
						className={cn(
							'ml-2 flex flex-col text-left transition-all duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)]',
							isCollapsed ? 'opacity-0 w-0' : 'opacity-100 w-auto'
						)}
					>
						<span className="text-sm font-medium text-emerald-400">
							{selectedWorkspace.label}
						</span>
						<span className="text-xs text-emerald-500/50">
							Workspace
						</span>
					</div>
					<ChevronsUpDown
						className={cn(
							'h-4 w-4 shrink-0 opacity-50 ml-auto text-emerald-400/50',
							isCollapsed ? 'hidden' : 'block'
						)}
					/>
				</button>
			</PopoverTrigger>
			<PopoverContent className="w-[300px] p-0 b border border-[#1f1f1f] rounded-lg shadow-xl">
				<Command className="bg-transparent">
					<CommandInput
						placeholder="Search workspace..."
						className="h-9 border-0 bg-transparent text-sm text-neutral-400 focus:ring-0 placeholder:text-neutral-500"
					/>
					<CommandList>
						<CommandEmpty className="py-6 text-sm text-neutral-400">
							No workspace found.
						</CommandEmpty>
						<CommandGroup>
							{workspaces.map((workspace) => (
								<CommandItem
									key={workspace.value}
									onSelect={() => {
										setSelectedWorkspace(workspace)
										setOpen(false)
									}}
									className={cn(
										'flex items-center gap-2 p-2 rounded cursor-pointer transition-colors duration-200',
										selectedWorkspace.value === workspace.value 
											? 'text-emerald-400 bg-emerald-500/5' 
											: 'hover:text-emerald-400 hover:bg-emerald-500/5 text-gray-400'
									)}
								>
									<div className="relative h-8 w-8 overflow-hidden rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-sm font-medium text-emerald-400/90">
										{workspace.label.charAt(0)}
									</div>
									<div className="flex flex-col">
										<span className="text-sm font-medium text-emerald-400">
											{workspace.label}
										</span>
										<span className="text-xs text-emerald-500/50">
											Workspace
										</span>
									</div>
									{selectedWorkspace.value === workspace.value && (
										<Check className="ml-auto h-4 w-4 text-emerald-400/50" />
									)}
								</CommandItem>
							))}
						</CommandGroup>
						<CommandSeparator className="my-2 bg-[#1f1f1f]" />
						<CommandGroup>
							<CommandItem
								onSelect={() => console.log('Create new workspace')}
								className="flex items-center gap-2 p-2 text-sm hover:text-emerald-400 hover:bg-emerald-500/5 cursor-pointer transition-colors duration-200"
							>
								<div className="relative h-8 w-8 overflow-hidden rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
									<Plus className="h-4 w-4 text-emerald-400/90" />
								</div>
								<span className="text-emerald-400/70">Create new workspace</span>
							</CommandItem>
						</CommandGroup>
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	)
}
