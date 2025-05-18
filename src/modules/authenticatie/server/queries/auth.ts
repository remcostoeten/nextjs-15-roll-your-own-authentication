'use server';

import { users } from '@/api/db/schema';
import { db } from 'db';
import { eq } from 'drizzle-orm';
import { getSession } from '../../helpers/session';

export async function getCurrentUser() {
	const session = await getSession();
	if (!session) return null;

	const [user] = await db
		.select({
			id: users.id,
			email: users.email,
			role: users.role,
		})
		.from(users)
		.where(eq(users.id, session.id));

	return user ?? null;
}
