'use server';

import { userRepository } from '@/api/db/user-repository';
import { redirect } from 'next/navigation';
import { verifyPassword } from '../../helpers/hash-password';
import { createSession } from '../../helpers/session';

const REDIRECT_ERROR_CODE = 'NEXT_REDIRECT';

export type LoginResult = {
	success: boolean;
	message: string;
	error?: string;
};

export async function login(formData: FormData): Promise<LoginResult> {
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
		const user = await userRepository.findByEmail(email);

		if (!user || !(await verifyPassword(password, user.password))) {
			return {
				success: false,
				message: 'Invalid credentials',
				error: 'The email or password you entered is incorrect',
			};
		}

		try {
			await createSession(user);

			// Return success before redirect
			const result: LoginResult = {
				success: true,
				message: `Welcome back, ${user.name || user.email}!`,
			};

			// Redirect to dashboard - this will throw a NEXT_REDIRECT error
			redirect('/dashboard');
			return result; // This won't be reached
		} catch (error) {
			// Check if it's a redirect error
			if (error instanceof Error && error.message === REDIRECT_ERROR_CODE) {
				throw error; // Re-throw redirect errors to handle the navigation
			}

			// For other session errors
			console.error('Session creation error:', error);
			return {
				success: false,
				message: 'Login failed',
				error: 'Failed to create session. Please try again.',
			};
		}
	} catch (error) {
		// Don't log redirect errors
		if (error instanceof Error && error.message === REDIRECT_ERROR_CODE) {
			throw error; // Re-throw redirect errors to handle the navigation
		}

		// Log and handle other errors
		console.error('Login error:', error);
		return {
			success: false,
			message: 'Login failed',
			error: error instanceof Error ? error.message : 'An unexpected error occurred',
		};
	}
}
