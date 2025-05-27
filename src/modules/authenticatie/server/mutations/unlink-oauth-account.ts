'use server';

import { getSession } from '../../helpers/session';
import { TOAuthProvider } from '../../types/oauth';
import { userRepository } from '../repositories/user-repository';

export async function unlinkOAuthAccount(provider: TOAuthProvider) {
	try {
		const session = await getSession();
		if (!session?.id) {
			return { success: false, error: 'Not authenticated' };
		}

		// Get the user to check if they have a password set
		const user = await userRepository().findById(session.id);
		if (!user) {
			return { success: false, error: 'User not found' };
		}

		// Check if the user has a password set
		if (!user.password) {
			// Count how many OAuth accounts the user has
			const oauthAccounts = await userRepository().findUserOAuthAccounts(session.id);

			// If this is their only OAuth account and they don't have a password, prevent unlinking
			if (oauthAccounts.length <= 1) {
				return {
					success: false,
					error: 'Cannot unlink your only authentication method. Please set a password first.',
					requiresPassword: true,
				};
			}
		}

		await userRepository().unlinkOAuthAccount(session.id, provider);
		return { success: true };
	} catch (error) {
		console.error('Error unlinking account:', error);
		return { success: false, error: 'Failed to unlink account' };
	}
}
