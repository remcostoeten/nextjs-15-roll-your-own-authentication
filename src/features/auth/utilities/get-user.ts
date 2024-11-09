/**
 * @description This function retrieves the user from the session cookie.
 * @author Remco Stoeten
 */
import { SessionUser } from '@/features/auth/types'
import { jwtVerify } from 'jose'
import { cookies } from 'next/headers'

const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'secret')

export async function getUser(): Promise<SessionUser | null> {
	const cookieStore = cookies()
	const token = (await cookieStore).get('session')?.value
	if (!token) return null

	try {
		const { payload } = await jwtVerify(token, secret)
		return payload as SessionUser
	} catch {
		return null
	}
}
