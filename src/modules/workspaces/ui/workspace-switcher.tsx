'use client';

import { toast } from '@/shared/components/toast';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { Button, Icons } from 'ui';
import { useWorkspace } from '../hooks/use-workspace';
import { createWorkspace } from '../server/mutations/create-workspace';

export function WorkspaceSwitcher() {
	const { currentWorkspace, workspaces, switchWorkspace, refreshWorkspaces } = useWorkspace();
	const [isOpen, setIsOpen] = useState(false);
	const [isCreating, setIsCreating] = useState(false);

	const handleCreateWorkspace = async (formData: FormData) => {
		setIsCreating(true);
		try {
			const result = await createWorkspace(formData);
			if (result.success && result.data) {
				await refreshWorkspaces();
				switchWorkspace(result.data);
				toast.success('Workspace created successfully');
				setIsOpen(false);
			} else {
				toast.error(result.error || 'Failed to create workspace');
			}
		} catch (error) {
			toast.error('Failed to create workspace');
		} finally {
			setIsCreating(false);
		}
	};

	if (!currentWorkspace) {
		return (
			<div className="flex items-center justify-center p-4">
				<div className="text-center space-y-4">
					<p className="text-white/60">No workspace selected</p>
					<Button
						onClick={() => setIsOpen(true)}
						className="bg-white text-black hover:bg-white/90"
					>
						Create Workspace
					</Button>
				</div>
			</div>
		);
	}

	return (
		<div className="relative">
			<Button
				onClick={() => setIsOpen(!isOpen)}
				variant="ghost"
				className="w-full justify-between h-auto p-3 hover:bg-white/5"
			>
				<div className="flex items-center space-x-3">
					<div className="flex-shrink-0 text-2xl">{currentWorkspace.emoji}</div>
					<div className="flex-1 text-left">
						<div className="font-medium text-white truncate">
							{currentWorkspace.title}
						</div>
						<div className="text-sm text-white/60">
							{currentWorkspace.memberCount} member
							{currentWorkspace.memberCount !== 1 ? 's' : ''}
						</div>
					</div>
				</div>
				<ChevronDown className="h-4 w-4 text-white/60" />
			</Button>

			{isOpen && (
				<div className="absolute top-full left-0 right-0 mt-1 bg-[rgb(15,15,15)] border border-[rgb(28,28,28)] rounded-lg shadow-lg z-50">
					<div className="p-2 space-y-1">
						{workspaces.map((workspace) => (
							<Button
								key={workspace.id}
								onClick={() => {
									switchWorkspace(workspace);
									setIsOpen(false);
								}}
								variant="ghost"
								className={`w-full justify-start h-auto p-3 hover:bg-white/5 ${
									workspace.id === currentWorkspace.id ? 'bg-white/10' : ''
								}`}
							>
								<div className="flex items-center space-x-3">
									<div className="flex-shrink-0 text-xl">{workspace.emoji}</div>
									<div className="flex-1 text-left">
										<div className="font-medium text-white truncate">
											{workspace.title}
										</div>
										<div className="text-sm text-white/60">
											{workspace.memberCount} member
											{workspace.memberCount !== 1 ? 's' : ''}
										</div>
									</div>
								</div>
								{workspace.id === currentWorkspace.id && (
									<Icons.check className="h-4 w-4 text-white ml-2" />
								)}
							</Button>
						))}
					</div>

					<div className="border-t border-[rgb(28,28,28)] p-2">
						<form action={handleCreateWorkspace} className="space-y-3">
							<div className="flex space-x-2">
								<input
									name="emoji"
									type="text"
									placeholder="🏢"
									maxLength={2}
									className="w-12 bg-[rgb(21,21,21)] border border-[rgb(28,28,28)] rounded px-2 py-1 text-center text-white"
									defaultValue="🏢"
								/>
								<input
									name="title"
									type="text"
									placeholder="New Workspace"
									required
									className="flex-1 bg-[rgb(21,21,21)] border border-[rgb(28,28,28)] rounded px-3 py-1 text-white placeholder:text-white/40"
								/>
							</div>
							<Button
								type="submit"
								disabled={isCreating}
								className="w-full bg-white text-black hover:bg-white/90"
								size="sm"
							>
								{isCreating ? (
									<>
										<Icons.spinner className="w-4 h-4 animate-spin mr-2" />
										Creating...
									</>
								) : (
									<>
										<Icons.plus className="w-4 h-4 mr-2" />
										Create Workspace
									</>
								)}
							</Button>
						</form>
					</div>
				</div>
			)}
		</div>
	);
}
