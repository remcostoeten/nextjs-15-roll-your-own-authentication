'use server';

import { createSession } from '@/modules/authenticatie/helpers/session';
import { userRepository } from '@/modules/authenticatie/server/repositories/user-repository';
import type { TAuthMutationResponse } from '../../types';

/**
 * Authenticates a user using credentials from the provided form data.
 *
 * Attempts to validate the user's email and password, creates a session on success, and returns an authentication response.
 *
 * @param formData - The form data containing user credentials.
 * @returns An authentication response indicating success or failure, with user details and redirect information on success.
 */
export async function login(formData: FormData): Promise<TAuthMutationResponse> {
	const email = formData.get('email')?.toString();
	const password = formData.get('password')?.toString();

	if (!email || !password) {
		return {
			success: false,
			error: 'Missing credentials',
		};
	}

	try {
		const user = await userRepository().validateCredentials(email, password);
		if (!user) {
			return {
				success: false,
				error: 'Invalid credentials',
			};
		}

		await createSession({
			id: user.id,
			email: user.email,
			role: user.role,
			...(user.name && { name: user.name }),
		});

		return {
			success: true,
			user,
			message: 'Login successful',
			redirect: '/dashboard',
		};
	} catch (error) {
		console.error('Login error:', error);
		if (error instanceof Error) {
			return {
				success: false,
				error: error.message,
			};
		}
		return {
			success: false,
			error: 'An unexpected error occurred',
		};
	}
}
