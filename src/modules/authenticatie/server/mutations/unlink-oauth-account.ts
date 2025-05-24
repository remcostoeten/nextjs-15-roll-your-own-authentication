'use server';

import { getSession } from '../../helpers/session';
import { userRepository } from '../../repositories/user-repository';
import { TOAuthProvider } from '../../types/oauth';

export async function unlinkOAuthAccount(provider: TOAuthProvider) {
    try {
        const session = await getSession();
        if (!session?.id) {
            return { success: false, error: 'Not authenticated' };
        }

        await userRepository().unlinkOAuthAccount(session.id, provider);
        return { success: true };
    } catch (error) {
        console.error('Error unlinking account:', error);
        return { success: false, error: 'Failed to unlink account' };
    }
}
