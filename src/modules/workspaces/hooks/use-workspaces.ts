'use client';

import { useCallback, useEffect, useState } from 'react';
import { getWorkspaces } from '../server/queries/get-workspaces';
import { TWorkspace } from '../types';

export function useWorkspaces() {
	const [workspaces, setWorkspaces] = useState<TWorkspace[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const fetchWorkspaces = useCallback(async () => {
		try {
			setIsLoading(true);
			const result = await getWorkspaces();

			if (result.success) {
				setWorkspaces(result.workspaces);
				setError(null);
			} else {
				setError(result.error || 'Failed to fetch workspaces');
			}
		} catch (err) {
			setError('An unexpected error occurred');
			console.error('Error in useWorkspaces:', err);
		} finally {
			setIsLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchWorkspaces();
	}, [fetchWorkspaces]);

	return {
		workspaces,
		isLoading,
		error,
		refetch: fetchWorkspaces,
	};
}
