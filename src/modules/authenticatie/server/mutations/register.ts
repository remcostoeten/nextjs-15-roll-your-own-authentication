'use server';

import { env } from '@/api/env';
import { z } from 'zod';
import { hashPassword } from '../../helpers/hash-password';
import { createSession } from '../../helpers/session';
import { userRepository } from '../../repositories/user-repository';
import type { TAuthMutationResponse } from '../../types';

const registerSchema = z.object({
	email: z.string().email('Invalid email address'),
	password: z.string().min(8, 'Password must be at least 8 characters'),
	name: z.string().optional(),
});

export async function register(formData: FormData): Promise<TAuthMutationResponse> {
	const email = formData.get('email')?.toString();
	const password = formData.get('password')?.toString();
	const name = formData.get('name')?.toString();
	const skipValidation = formData.get('skip_validation')?.toString() === 'true';

	if (!email || !password) {
		return {
			success: false,
			error: 'Missing credentials',
		};
	}

	try {
		// Always validate email
		registerSchema.shape.email.parse(email);

		// Only validate password if skip_validation is false
		if (!skipValidation) {
			registerSchema.shape.password.parse(password);
		}

		const existing = await userRepository().findByEmail(email);
		if (existing) {
			return {
				success: false,
				error: 'Email already in use',
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

		const hashedPassword = await hashPassword(password);

		// Create the user
		const user = await userRepository().create({
			email,
			password: hashedPassword,
			role: isAdmin ? 'admin' : 'user',
			avatar: randomAvatar,
			name: name || email.split('@')[0], // Set a default name from email
		});

		// Create the session
		await createSession(user);

		return {
			success: true,
			user,
			message: 'Registration successful',
			redirect: '/dashboard',
		};
	} catch (error) {
		console.error('Registration error:', error);
		if (error instanceof z.ZodError) {
			return {
				success: false,
				error: error.errors[0].message,
			};
		}
		if (error instanceof Error) {
			return {
				success: false,
				error: error.message,
			};
		}
		return {
			success: false,
			error: 'An unexpected error occurred. Please try again.',
		};
	}
}
