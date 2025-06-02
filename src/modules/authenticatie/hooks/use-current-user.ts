'use client';

import { useCallback, useEffect, useState } from 'react';
import { TAuthUser } from '../types';
import { getCurrentUser } from '../server/queries/get-current-user';

export function useCurrentUser() {
	const [user, setUser] = useState<Partial<TAuthUser> | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const fetchUser = useCallback(async () => {
		try {
			setIsLoading(true);
			const result = await getCurrentUser();

			if (result.success && result.user) {
				setUser(result.user);
				setError(null);
			} else {
				setError(result.error || 'Failed to fetch user data');
				setUser(null);
			}
		} catch (err) {
			setError('An unexpected error occurred');
			setUser(null);
			console.error('Error in useCurrentUser:', err);
		} finally {
			setIsLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchUser();
	}, [fetchUser]);

	return {
		user,
		isLoading,
		error,
		refetch: fetchUser,
	};
}
