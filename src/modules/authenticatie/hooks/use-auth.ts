'use client';

import { useEffect, useState } from 'react';
import { logout } from '../server/mutations/logout';
import { getCurrentUser } from '../server/queries/get-current-user';
import type { AuthState, AuthUser } from '../types';

export function useAuth() {
	const [state, setState] = useState<AuthState>({ status: 'loading' });

	useEffect(() => {
		async function fetchUser() {
			try {
				const user = await getCurrentUser();
				if (user?.id) {
					setState({ status: 'authenticated', user: user as AuthUser });
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
