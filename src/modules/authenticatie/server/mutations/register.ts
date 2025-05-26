'use server';

import { createSession } from '@/modules/authenticatie/helpers/session';
import { createUser } from '@/modules/authenticatie/repositories/user-repository';
import { z } from 'zod';

const registerSchema = z.object({
	name: z.string().min(2, 'Name must be at least 2 characters'),
	email: z.string().email('Invalid email address'),
	password: z.string().min(8, 'Password must be at least 8 characters'),
});

export async function register(formData: FormData) {
	try {
		const validatedFields = registerSchema.parse({
			name: formData.get('name'),
			email: formData.get('email'),
			password: formData.get('password'),
		});

		const user = await createUser({
			name: validatedFields.name,
			email: validatedFields.email,
			password: validatedFields.password,
		});

		if (!user) {
			return {
				success: false,
				error: 'Failed to create account',
			};
		}

		// Create session
		await createSession({
			id: user.id,
			email: user.email,
			role: user.role || 'user',
			name: user.name,
		});

		return {
			success: true,
			message: 'Account created successfully',
			redirect: '/dashboard',
		};
	} catch (error) {
		console.error('Register error:', error);
		if (error instanceof z.ZodError) {
			return {
				success: false,
				error: error.errors[0].message,
			};
		}

		return {
			success: false,
			error: 'Something went wrong',
		};
	}
}
