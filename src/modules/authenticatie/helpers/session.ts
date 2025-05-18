'use server';

import { randomUUID } from 'crypto';
import { sessions } from '@/api/db/schema';
import { db } from 'db';
import { cookies } from 'next/headers';
import { signJwt, verifyJwt } from './jwt';

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
	name?: string | null;
	avatar?: string | null;
	createdAt?: Date | null;
	updatedAt?: Date | null;
}) {
	const token = await signJwt({
		id: user.id,
		email: user.email,
		role: user.role,
		name: user.name || null,
		avatar: user.avatar || null,
		createdAt: user.createdAt || null,
		updatedAt: user.updatedAt || null,
	});

	const expiresAt = new Date();
	expiresAt.setDate(expiresAt.getDate() + SESSION_EXPIRY_DAYS);

	await db.insert(sessions).values({
		id: randomUUID(),
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

	const payload = await verifyJwt(token);
	if (!payload) {
		cookieStore.delete(COOKIE_NAME);
		return null;
	}

	return payload;
}
