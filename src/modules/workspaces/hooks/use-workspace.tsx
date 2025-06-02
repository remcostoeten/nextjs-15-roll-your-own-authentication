'use client';

import { TWorkspaceWithOwner } from '@/modules/workspaces/types';
import { createContext, useContext, useEffect, useState } from 'react';

type TWorkspaceContextType = {
	currentWorkspace: TWorkspaceWithOwner | null;
	workspaces: TWorkspaceWithOwner[];
	isLoading: boolean;
	switchWorkspace: (workspace: TWorkspaceWithOwner) => void;
	refreshWorkspaces: () => Promise<void>;
	setCurrentWorkspace: (workspace: TWorkspaceWithOwner | null) => void;
};

const WorkspaceContext = createContext<TWorkspaceContextType | null>(null);

export function useWorkspace() {
	const context = useContext(WorkspaceContext);
	if (!context) {
		throw new Error('useWorkspace must be used within a WorkspaceProvider');
	}
	return context;
}

type WorkspaceProviderProps = {
	children: React.ReactNode;
	initialWorkspace?: TWorkspaceWithOwner | null;
	initialWorkspaces?: TWorkspaceWithOwner[];
};

export function WorkspaceProvider({
	children,
	initialWorkspace = null,
	initialWorkspaces = [],
}: WorkspaceProviderProps) {
	const [currentWorkspace, setCurrentWorkspace] = useState<TWorkspaceWithOwner | null>(
		initialWorkspace
	);
	const [workspaces, setWorkspaces] = useState<TWorkspaceWithOwner[]>(initialWorkspaces);
	const [isLoading, setIsLoading] = useState(false);

	const switchWorkspace = (workspace: TWorkspaceWithOwner) => {
		setCurrentWorkspace(workspace);
		// Store in sessionStorage for persistence across page reloads
		if (typeof window !== 'undefined') {
			sessionStorage.setItem('currentWorkspaceId', workspace.id);
		}
	};

	const refreshWorkspaces = async () => {
		setIsLoading(true);
		try {
			const response = await fetch('/api/workspaces');
			if (response.ok) {
				const data = await response.json();
				setWorkspaces(data.workspaces || []);

				// If current workspace is not in the list, switch to first available
				if (
					currentWorkspace &&
					!data.workspaces?.find((w: TWorkspaceWithOwner) => w.id === currentWorkspace.id)
				) {
					const firstWorkspace = data.workspaces?.[0];
					if (firstWorkspace) {
						switchWorkspace(firstWorkspace);
					} else {
						setCurrentWorkspace(null);
					}
				}
			}
		} catch (error) {
			console.error('Failed to refresh workspaces:', error);
		} finally {
			setIsLoading(false);
		}
	};

	// Load workspace from sessionStorage on mount
	useEffect(() => {
		const savedWorkspaceId =
			typeof window !== 'undefined' ? sessionStorage.getItem('currentWorkspaceId') : null;

		if (savedWorkspaceId && workspaces.length > 0) {
			const savedWorkspace = workspaces.find((w) => w.id === savedWorkspaceId);
			if (savedWorkspace) {
				setCurrentWorkspace((prev) => {
					if (!prev || prev.id !== savedWorkspaceId) {
						return savedWorkspace;
					}
					return prev;
				});
			}
		} else if (workspaces.length > 0) {
			setCurrentWorkspace((prev) => {
				if (!prev) {
					return workspaces[0];
				}
				return prev;
			});
		}
	}, [workspaces]);

	return (
		<WorkspaceContext.Provider
			value={{
				currentWorkspace,
				workspaces,
				isLoading,
				switchWorkspace,
				refreshWorkspaces,
				setCurrentWorkspace,
			}}
		>
			{children}
		</WorkspaceContext.Provider>
	);
}
