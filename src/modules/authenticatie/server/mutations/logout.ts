'use server';

import { destroySession } from '../../helpers/session';

export async function logout() {
	await destroySession();
	return { success: true };
}
