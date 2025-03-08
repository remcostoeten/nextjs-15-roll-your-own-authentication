import { NextRequest, NextResponse } from 'next/server'
import { logoutUser } from '@/modules/authentication/api/mutations/logout-user'

export async function POST(request: NextRequest) {
	try {
		// Get the refresh token from cookies
		const refreshToken = request.cookies.get('refresh_token')?.value

		// Call the logout function
		await logoutUser(refreshToken)

		// Create a response
		const response = NextResponse.json({ success: true }, { status: 200 })

		// Clear cookies
		response.cookies.delete('access_token')
		response.cookies.delete('refresh_token')

		return response
	} catch (error) {
		console.error('Logout error:', error)
		// Even if there's an error, we still want to clear cookies on the client
		const response = NextResponse.json(
			{
				error:
					error instanceof Error
						? error.message
						: 'An error occurred during logout',
			},
			{ status: 500 }
		)

		response.cookies.delete('access_token')
		response.cookies.delete('refresh_token')

		return response
	}
}
