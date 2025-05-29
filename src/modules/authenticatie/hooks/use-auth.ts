'use client';

import { useEffect, useState } from 'react';
import { logout } from '../server/mutations/logout';
import { getCurrentUser } from '../server/queries/get-current-user';
import type { TAuthState, TAuthUser } from '../types';

export function useAuth() {
	const [state, setState] = useState<TAuthState>({ status: 'loading' });

	useEffect(() => {
		async function fetchUser() {
			try {
				const result = await getCurrentUser();
				if (result.success && result.user?.id) {
					setState({ status: 'authenticated', user: result.user as TAuthUser });
				} else {
					setState({ status: 'unauthenticated' });
				}
			} catch (error) {
				console.error('Error fetching user:', error);
				setState({ status: 'unauthenticated' });
			}
		}

		fetchUser();
	}, []);

	const signOut = async () => {
		try {
			await logout();
			setState({ status: 'unauthenticated' });
		} catch (error) {
			console.error('Error signing out:', error);
		}
	};

	const updateUser = (user: TAuthUser) => {
		setState({ status: 'authenticated', user });
	};

	return {
		...state,
		signOut,
		updateUser,
	};
}
