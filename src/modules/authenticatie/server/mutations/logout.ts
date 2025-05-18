'use server';

import { redirect } from 'next/navigation';
import { destroySession } from '../../helpers/session';

export async function logout() {
	await destroySession();

	redirect('/login');
}
