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
				const user = await getCurrentUser();
				if (user?.id) {
					setState({ status: 'authenticated', user: user as TAuthUser });
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

	return {
		...state,
		signOut,
	};
}
