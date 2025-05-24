'use server';

import { createSession } from 'modules/authenticatie/helpers/session';
import { userRepository } from 'modules/authenticatie/repositories/user-repository';
import type { TAuthMutationResponse } from '../../types';

export async function login(formData: FormData): Promise<TAuthMutationResponse> {
	const email = formData.get('email')?.toString();
	const password = formData.get('password')?.toString();

	if (!email || !password) {
		return {
			success: false,
			error: 'Missing credentials'
		};
	}

	try {
		const user = await userRepository().validateCredentials(email, password);
		if (!user) {
			return {
				success: false,
				error: 'Invalid credentials'
			};
		}

		await createSession(user);
		return {
			success: true,
			user,
			message: 'Login successful',
			redirect: '/dashboard'
		};
	} catch (error) {
		console.error('Login error:', error);
		if (error instanceof Error) {
			return {
				success: false,
				error: error.message
			};
		}
		return {
			success: false,
			error: 'An unexpected error occurred'
		};
	}
}
