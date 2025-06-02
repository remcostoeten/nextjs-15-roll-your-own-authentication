import { UserProvider } from '@/modules/authenticatie/context/user-context';
import { getSession } from '@/modules/authenticatie/helpers/session';
import { TUserRole } from '@/shared/types/base';
import { asUUID } from '@/shared/types/common';
import { ReactNode } from 'react';

/**
 * Wraps child components with a user context provider, supplying user data from the current session if available.
 *
 * If a session exists, constructs a user object with session details and default values for missing fields; otherwise, provides `null` as the user.
 *
 * @param children - React nodes to be rendered within the user context.
 */
export async function UserProviderWrapper({ children }: { children: ReactNode }) {
	const session = await getSession();

	return (
		<UserProvider
			user={
				session
					? {
							id: asUUID(session.id),
							name: session.name || null,
							email: session.email,
							role: session.role as TUserRole,
							avatar: null,
							emailVerified: null,
							lastLoginAt: null,
							createdAt: new Date(),
							updatedAt: new Date(),
					  }
					: null
			}
		>
			{children}
		</UserProvider>
	);
}
