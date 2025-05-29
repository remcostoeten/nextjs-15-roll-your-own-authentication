'use server';

import { db } from 'db';
import { cookies } from 'next/headers';
import { sessions } from 'schema';
import { signJWT, verifyJWT } from './jwt';

const COOKIE_NAME = 'auth_token';
const COOKIE_OPTIONS = {
	httpOnly: true,
	path: '/',
	secure: process.env.NODE_ENV === 'production',
	sameSite: 'lax',
} as const;

const SESSION_EXPIRY_DAYS = 7;

export async function createSession(user: {
	id: string;
	email: string;
	role: string;
	name?: string;
}) {
	const token = await signJWT({
		sub: user.id,
		email: user.email,
		role: user.role,
		...(user.name && { name: user.name }),
	});

	const expiresAt = new Date();
	expiresAt.setDate(expiresAt.getDate() + SESSION_EXPIRY_DAYS);

	await db.insert(sessions).values({
		userId: user.id,
		expiresAt,
	});

	const cookieStore = await cookies();
	cookieStore.set(COOKIE_NAME, token, {
		...COOKIE_OPTIONS,
		maxAge: 60 * 60 * 24 * SESSION_EXPIRY_DAYS,
	});
}

export async function destroySession() {
	const cookieStore = await cookies();
	cookieStore.delete(COOKIE_NAME);
}

export async function getSession() {
	const cookieStore = await cookies();
	const token = cookieStore.get(COOKIE_NAME)?.value;
	if (!token) return null;

	const payload = await verifyJWT(token);
	if (!payload) {
		cookieStore.delete(COOKIE_NAME);
		return null;
	}

	// Map JWT payload to session format
	return {
		id: payload.sub as string,
		email: payload.email as string,
		role: payload.role as string,
		name: payload.name as string,
	};
}
