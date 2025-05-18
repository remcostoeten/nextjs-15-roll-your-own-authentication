'use server';

import { redirect } from 'next/navigation';
import { getSession } from './session';

export async function requireAuth() {
	const session = await getSession();
	if (!session) {
		redirect('/login');
	}
	return session;
}

export async function requireRole(role: 'admin') {
	const session = await getSession();
	if (!session || session.role !== role) {
		redirect('/dashboard');
	}
	return session;
}
