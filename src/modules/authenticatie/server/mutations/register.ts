'use server';

import { userRepository } from '@/api/db/user-repository';
import { env } from '@/api/env';
import { redirect } from 'next/navigation';
import { createSession } from '../../helpers/session';

const REDIRECT_ERROR_CODE = 'NEXT_REDIRECT';

export type RegisterResult = {
	success: boolean;
	message: string;
	error?: string;
};

export async function register(formData: FormData): Promise<RegisterResult> {
	const email = formData.get('email')?.toString();
	const password = formData.get('password')?.toString();

	if (!email || !password) {
		return {
			success: false,
			message: 'Missing credentials',
			error: 'Please provide both email and password',
		};
	}

	try {
		const existing = await userRepository.findByEmail(email);
		if (existing) {
			return {
				success: false,
				message: 'Email already in use',
				error: 'This email is already registered. Please try logging in instead.',
			};
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

		const defaultName = email.split('@')[0];

		// Create the user
		const user = await userRepository.create({
			email,
			password,
			role: isAdmin ? 'admin' : 'user',
			avatar: randomAvatar,
			name: defaultName,
		});

		// Create the session
		try {
			await createSession(user);

			// Return success before redirect
			const result: RegisterResult = {
				success: true,
				message: `Welcome to the app, ${defaultName}!`,
			};

			redirect('/dashboard');
		} catch (error) {
			// Check if it's a redirect error
			if (error instanceof Error && error.message === REDIRECT_ERROR_CODE) {
				throw error; // Re-throw redirect errors to handle the navigation
			}

			// For other session errors, clean up and return error
			console.error('Session creation error:', error);
			await userRepository.delete(user.id);
			return {
				success: false,
				message: 'Registration failed',
				error: 'Failed to create session. Please try again.',
			};
		}
	} catch (error) {
		// Don't log redirect errors
		if (error instanceof Error && error.message === REDIRECT_ERROR_CODE) {
			throw error; // Re-throw redirect errors to handle the navigation
		}

		// Log and handle other errors
		console.error('Registration error:', error);
		return {
			success: false,
			message: 'Registration failed',
			error: error instanceof Error ? error.message : 'An unexpected error occurred. Please try again.',
		};
	}
}
