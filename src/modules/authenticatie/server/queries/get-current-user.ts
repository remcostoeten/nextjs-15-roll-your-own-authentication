'use server';

import { db } from 'db';
import { eq } from 'drizzle-orm';
import { users } from 'schema';
import { getSession } from '../../helpers/session';

export async function getCurrentUser() {
	const session = await getSession();
	if (!session) return null;

	const [user] = await db
		.select({
			id: users.id,
			email: users.email,
			role: users.role,
			name: users.name,
			avatar: users.avatar,
			createdAt: users.createdAt,
		})
		.from(users)
		.where(eq(users.id, session.id));

	return user ?? null;
}
