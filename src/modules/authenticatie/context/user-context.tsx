'use client';

import { TAuthUser } from '@/modules/authenticatie/types';
import { noop } from '@/shared/utilities/noop';
import { ReactNode, createContext, useContext, useMemo } from 'react';

type UserContextType = {
	user: TAuthUser | null;
	isLoading: boolean;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

/**
 * Provides authenticated user state and loading status to descendant components via React context.
 *
 * Wraps children in a {@link UserContext.Provider} with the current user and loading state.
 *
 * @param children - React nodes that will have access to the user context.
 * @param user - The authenticated user object or null if not authenticated.
 * @param isLoading - Indicates whether user authentication status is being determined. Defaults to false.
 */
export function UserProvider({
	children,
	user,
	isLoading = false,
}: {
	children: ReactNode;
	user: TAuthUser | null;
	isLoading?: boolean;
}) {
	// Note: experimental_taintUniqueValue is not available in this React version
	// This would be used to protect sensitive user data in server components

	// Memoize the context value to prevent unnecessary re-renders
	const value = useMemo(
		() => ({
			user,
			isLoading,
		}),
		[user, isLoading]
	);

	return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

/**
 * Returns the current authenticated user context.
 *
 * @returns The user context value, including the authenticated user and loading state.
 *
 * @throws {Error} If called outside of a {@link UserProvider}.
 */
export function useUser() {
	const context = useContext(UserContext);
	if (context === undefined) {
		throw new Error('useUser must be used within a UserProvider');
	}
	return context;
}
