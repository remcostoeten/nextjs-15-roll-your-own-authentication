'use server';

import { getSession } from '../../helpers/session';
import { userRepository } from '../repositories/user-repository';
import { TAuthUser } from '../../types';

/**
 * Retrieves the currently authenticated user's public profile information.
 *
 * Attempts to obtain the current session and fetch the user by session ID. Returns a success response with selected user fields if authenticated, or an error message if not authenticated, user not found, or an unexpected error occurs.
 *
 * @returns An object containing a `success` flag, a partial user object if authenticated, and an error message if applicable.
 */
export async function getCurrentUser(): Promise<{
	user?: Partial<TAuthUser>;
	success: boolean;
	error?: string;
}> {
	try {
		const session = await getSession();

		if (!session?.id) {
			return { success: false, error: 'Not authenticated' };
		}

		const user = await userRepository().findById(session.id);

		if (!user) {
			return { success: false, error: 'User not found' };
		}

		// Return user data without sensitive information
		return {
			success: true,
			user: {
				id: user.id,
				email: user.email,
				name: user.name,
				avatar: user.avatar,
				role: user.role,
				createdAt: user.createdAt,
				updatedAt: user.updatedAt,
			},
		};
	} catch (error) {
		console.error('Error fetching user:', error);
		return { success: false, error: 'Failed to fetch user data' };
	}
}
