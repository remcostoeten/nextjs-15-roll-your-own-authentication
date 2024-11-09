'use server'

import { signOut } from '@/features/auth/actions'
import { redirect } from 'next/navigation'

export async function handleSignOut() {
	await signOut()
	redirect('/sign-in')
}
