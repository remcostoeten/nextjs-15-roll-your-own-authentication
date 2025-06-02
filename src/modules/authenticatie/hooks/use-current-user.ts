'use client';

import { useCallback, useEffect, useState } from 'react';
import { TAuthUser } from '../types';
import { getCurrentUser } from '../server/queries/get-current-user';

/**
 * React hook for accessing and managing the current authenticated user's state.
 *
 * Provides the current user data, loading status, error message, and a function to refetch user information.
 *
 * @returns An object containing the current user (`user`), loading state (`isLoading`), error message (`error`), and a `refetch` function to reload user data.
 */
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
