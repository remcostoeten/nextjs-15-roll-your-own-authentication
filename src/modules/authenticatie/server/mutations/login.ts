'use server';

import { verifyPassword } from 'modules/authenticatie/helpers/hash-password';
import { createSession } from 'modules/authenticatie/helpers/session';
import { userRepository } from 'modules/authenticatie/repositories/user-repository';
import { redirect } from 'next/navigation';

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
