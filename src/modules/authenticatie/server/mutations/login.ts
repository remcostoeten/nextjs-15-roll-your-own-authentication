'use server';

import { userRepository } from '@/api/db/user-repository';
import { redirect } from 'next/navigation';
import { verifyPassword } from '../../helpers/hash-password';
import { createSession } from '../../helpers/session';

export async function login(formData: FormData) {
	const email = formData.get('email')?.toString();
	const password = formData.get('password')?.toString();

	if (!email || !password) {
		throw new Error('Missing credentials');
	}

	const user = await userRepository.findByEmail(email);

	if (!user || !(await verifyPassword(password, user.password))) {
		throw new Error('Invalid credentials');
	}

	await createSession(user);
	redirect('/dashboard');
}
