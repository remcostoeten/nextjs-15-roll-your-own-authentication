import { db } from '@/server/db'
import { sessions } from '@/server/db/schema'
import { eq } from 'drizzle-orm'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

/**
 * API endpoint to check if user is authenticated
 * @author Remco Stoeten
 */
export async function GET() {
	try {
		const cookieStore = await cookies()
		const sessionToken = cookieStore.get('session')?.value

		if (!sessionToken) {
			return new NextResponse('Unauthorized', { status: 401 })
		}

		// Check if session exists and is valid
		const session = await db.query.sessions.findFirst({
			where: eq(sessions.token, sessionToken),
			with: {
				user: true
			}
		})

		if (!session || new Date(session.expiresAt) < new Date()) {
			return new NextResponse('Unauthorized', { status: 401 })
		}

		return NextResponse.json({ authenticated: true })
	} catch (error) {
		console.error('Auth check error:', error)
		return new NextResponse('Internal Server Error', { status: 500 })
	}
}
