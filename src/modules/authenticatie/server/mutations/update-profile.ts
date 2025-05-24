'use server';

import { userRepository } from '../../repositories/user-repository';

export async function updateProfile(formData: FormData) {
	const name = formData.get('name') as string;
	const email = formData.get('email') as string;
	const currentPassword = formData.get('current-password') as string;
	const newPassword = formData.get('new-password') as string;

	try {
		if (!name || !email) {
			throw new Error('Name and email are required');
		}

		// Only include password fields if both are provided
		const updateData: any = {
			name,
			email,
		};

		if (currentPassword && newPassword) {
			updateData.currentPassword = currentPassword;
			updateData.newPassword = newPassword;
		}

		const user = await userRepository().update(updateData.id, updateData);
		return { success: true, user };
	} catch (error) {
		console.error('Error updating profile:', error);
		return { success: false, error: 'Failed to update profile' };
	}
}
