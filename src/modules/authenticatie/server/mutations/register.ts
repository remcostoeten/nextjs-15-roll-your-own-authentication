'use server';

import { userRepository } from '@/api/db/user-repository';
import { env } from '@/api/env';
import { redirect } from 'next/navigation';
import { createSession } from '../../helpers/session';

const REDIRECT_ERROR_CODE = 'NEXT_REDIRECT';

export async function register(formData: FormData) {
	const email = formData.get('email')?.toString();
	const password = formData.get('password')?.toString();

	if (!email || !password) {
		throw new Error('Missing credentials');
	}

	try {
		const existing = await userRepository.findByEmail(email);
		if (existing) {
			throw new Error('Email already in use');
		}

		const AVATAR_OPTIONS = {
			FAT_MAJIN_BUU:
				'https://pa1.narvii.com/5858/8b61faaa49264942a3cf812503cccab83fe515a8_hq.gif',
			FAT_MAJIN_BUU_2: 'https://c.tenor.com/d9GvSsPKxe8AAAAM/majin-buu-buu.gif',
			FAT_MAJIN_BUU_3:
				'https://www.laguiadelvaron.com/wp-content/uploads/2018/03/majin_bu_dog.gif',
			FAT_MAJIN_BUU_4: 'https://c.tenor.com/xHMtksLVNlcAAAAC/dbz-gif.gif',
			FAT_MAJIN_BUU_5: 'https://media.tenor.com/z5Y_hp08qAEAAAAC/buu-tongue.gif',
			FAT_MAJIN_BUU_6: 'https://c.tenor.com/K3AE3cWEj3QAAAAM/eating-buu.gif',
		};

		const isAdmin = email === env.ADMIN_EMAIL;
		const randomAvatar =
			Object.values(AVATAR_OPTIONS)[
				Math.floor(Math.random() * Object.values(AVATAR_OPTIONS).length)
			];

		// Create the user
		const user = await userRepository.create({
			email,
			password,
			role: isAdmin ? 'admin' : 'user',
			avatar: randomAvatar,
			name: email.split('@')[0], // Set a default name from email
		});

		// Create the session
		try {
			await createSession(user);
		} catch (error) {
			console.error('Session creation error:', error);
			// Only clean up if it's not a redirect
			if (!(error instanceof Error && error.message === REDIRECT_ERROR_CODE)) {
				await userRepository.delete(user.id);
				throw new Error('Failed to create session. Please try again.');
			}
		}

		// If we get here, everything worked
		redirect('/dashboard');
	} catch (error) {
		console.error('Registration error:', error);
		// Re-throw user-friendly errors
		if (error instanceof Error) {
			throw error;
		}
		// For unknown errors, throw a generic message
		throw new Error('An unexpected error occurred. Please try again.');
	}
}
