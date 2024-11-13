'use server'

import { cookies } from 'next/headers'

export async function clearAuthCookie() {
	;(await cookies()).delete('auth_token')
}
