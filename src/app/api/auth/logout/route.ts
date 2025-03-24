import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET() {
	const cookieStore = cookies()

	// Clear auth cookies
	await cookieStore.delete('accessToken')
	await cookieStore.delete('refreshToken')
	await cookieStore.delete('session')

	// Redirect to login
	return NextResponse.redirect(new URL('/login', process.env.NEXT_PUBLIC_BASE_URL))
}
