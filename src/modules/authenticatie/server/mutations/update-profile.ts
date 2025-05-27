'use server';

import { getSession } from '../../helpers/session';
import { TUpdateProfileData } from '../../types';
import { userRepository } from '../repositories/user-repository';

export async function updateProfile(formData: FormData) {
	const name = formData.get('name') as string;
	const email = formData.get('email') as string;
	const currentPassword = formData.get('current-password') as string;
	const newPassword = formData.get('new-password') as string;

	try {
		const session = await getSession();
		if (!session?.id) {
			throw new Error('Not authenticated');
		}

		if (!name || !email) {
			throw new Error('Name and email are required');
		}

		const updateData: TUpdateProfileData = {
			name,
			email,
		};

		if (currentPassword && newPassword) {
			updateData.currentPassword = currentPassword;
			updateData.newPassword = newPassword;
		}

		const user = await userRepository().update(session.id, updateData);
		return { success: true, user };
	} catch (error) {
		console.error('Error updating profile:', error);
		if (error instanceof Error) {
			return { success: false, error: error.message };
		}
		return { success: false, error: 'Failed to update profile' };
	}
}
