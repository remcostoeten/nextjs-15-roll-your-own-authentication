'use server';

import { signJWT } from '@/modules/authenticatie/helpers/jwt';
import { createUser } from '@/modules/authenticatie/repositories/user-repository';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
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

		// Create session token
		const token = await signJWT({
			sub: user.id,
			name: user.name,
			email: user.email,
		});

		// Set session cookie
		cookies().set('session', token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'lax',
			maxAge: 60 * 60 * 24 * 7, // 1 week
		});

		redirect('/dashboard');
	} catch (error) {
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
