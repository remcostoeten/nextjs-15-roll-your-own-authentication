'use client';

import { useEffect, useState } from 'react';
import { logout } from '../server/mutations/logout';

export type TUser = {
	id: string;
	email: string;
	role: string;
	name?: string | null;
	avatar?: string | null;
};

export type AuthState =
	| { status: 'loading' }
	| { status: 'authenticated'; user: TUser }
	| { status: 'unauthenticated' };

export function useAuth() {
	const [state, setState] = useState<AuthState>({ status: 'loading' });

	useEffect(() => {
		async function fetchUser() {
			try {
				const res = await fetch('/api/auth/me');
				if (!res.ok) {
					setState({ status: 'unauthenticated' });
					return;
				}

				const user = await res.json();
				if (user?.id) {
					setState({ status: 'authenticated', user });
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
