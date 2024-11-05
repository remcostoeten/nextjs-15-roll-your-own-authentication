'use server'

import { signOut } from '@/features/auth/actions/auth'
import { redirect } from 'next/navigation'

export async function handleSignOut() {
	await signOut()
	redirect('/sign-in')
}
