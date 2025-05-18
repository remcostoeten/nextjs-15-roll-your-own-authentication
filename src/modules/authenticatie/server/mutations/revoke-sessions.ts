'use server';

import { sessions } from '@/api/db/schema';
import { db } from 'db';
import { eq } from 'drizzle-orm';
import { requireAuth } from '../../helpers/guards';

export async function revokeSessions() {
	const user = await requireAuth();

	await db.delete(sessions).where(eq(sessions.userId, user?.id));

	return { success: true };
}
