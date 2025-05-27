'use server';

import { hashPassword } from '../../helpers/password';
import { getSession } from '../../helpers/session';
import { userRepository } from '../repositories/user-repository';

export async function setPassword(password: string) {
	try {
		const session = await getSession();
		if (!session?.id) {
			return { success: false, error: 'Not authenticated' };
		}

		// Validate password
		if (password.length < 8) {
			return { success: false, error: 'Password must be at least 8 characters' };
		}

		// Hash the password
		const hashedPassword = await hashPassword(password);

		// Update the user's password
		await userRepository().updatePassword(session.id, hashedPassword);

		return { success: true };
	} catch (error) {
		console.error('Error setting password:', error);
		return { success: false, error: 'Failed to set password' };
	}
}
