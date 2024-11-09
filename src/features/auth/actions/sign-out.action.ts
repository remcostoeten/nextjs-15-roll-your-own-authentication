/**
 * @author Remco Stoeten
 * @description Clears the user session.
 *
 * @returns Updated authentication state.
 */

'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { clearSession } from '../services/session.service'

export async function signOut(): Promise<void> {
	await clearSession()
	revalidatePath('/', 'layout')
	redirect('/sign-in')
}
