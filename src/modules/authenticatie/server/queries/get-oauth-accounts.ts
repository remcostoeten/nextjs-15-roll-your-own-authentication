'use server';

import { getSession } from '../../helpers/session';
import { userRepository } from '../../repositories/user-repository';

export async function getOAuthAccounts() {
    try {
        const session = await getSession();
        if (!session?.id) {
            return { success: false, error: 'Not authenticated' };
        }

        const accounts = await userRepository().findUserOAuthAccounts(session.id);
        return { success: true, accounts };
    } catch (error) {
        console.error('Error loading OAuth accounts:', error);
        return { success: false, error: 'Failed to load accounts' };
    }
}
