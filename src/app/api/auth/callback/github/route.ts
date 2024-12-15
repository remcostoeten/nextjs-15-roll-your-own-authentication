import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { SignJWT } from 'jose'
import prisma from '@/server/db'
const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
const secretKey = new TextEncoder().encode(
	process.env.JWT_SECRET || 'your-secret-key'
)

interface GithubOAuthToken {
	access_token: string
	token_type: string
	scope: string
	error?: string
	error_description?: string
}

interface GithubUser {
	id: number
	login: string
	name: string | null
	avatar_url: string
	email: string | null
}

interface GithubEmail {
	email: string
	primary: boolean
	verified: boolean
	visibility: string | null
}

export async function GET(request: Request) {
	try {
		const searchParams = new URL(request.url).searchParams
		const code = searchParams.get('code')
		const state = searchParams.get('state')
		const cookieStore = cookies()
		const storedState = (await cookieStore).get('github_oauth_state')?.value

		console.log('OAuth Callback:', {
			code: code?.slice(0, 5) + '...',
			state,
			storedState,
			clientId: GITHUB_CLIENT_ID?.slice(0, 5) + '...'
		})

		if (!code) {
			return NextResponse.redirect(
				new URL('/login?error=No authorization code received', APP_URL)
			)
		}

		if (!state || !storedState || state !== storedState) {
			console.error('State mismatch:', { state, storedState })
			return NextResponse.redirect(
				new URL('/login?error=Invalid state parameter', APP_URL)
			)
		}

		if (!GITHUB_CLIENT_ID || !GITHUB_CLIENT_SECRET) {
			console.error('Missing credentials:', {
				hasClientId: !!GITHUB_CLIENT_ID,
				hasClientSecret: !!GITHUB_CLIENT_SECRET
			})
			return NextResponse.redirect(
				new URL('/login?error=OAuth configuration error', APP_URL)
			)
		}

		// Exchange code for access token
		const tokenResponse = await fetch(
			'https://github.com/login/oauth/access_token',
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Accept: 'application/json'
				},
				body: JSON.stringify({
					client_id: GITHUB_CLIENT_ID,
					client_secret: GITHUB_CLIENT_SECRET,
					code,
					redirect_uri: `${APP_URL}/api/auth/callback/github`
				})
			}
		)

		if (!tokenResponse.ok) {
			const errorText = await tokenResponse.text()
			console.error('Token exchange failed:', errorText)
			return NextResponse.redirect(
				new URL(
					'/login?error=Failed to authenticate with GitHub',
					APP_URL
				)
			)
		}

		const tokenData: GithubOAuthToken = await tokenResponse.json()
		console.log('Token response:', {
			hasToken: !!tokenData.access_token,
			error: tokenData.error,
			errorDesc: tokenData.error_description
		})

		if (tokenData.error) {
			console.error('GitHub token error:', tokenData)
			return NextResponse.redirect(
				new URL(
					`/login?error=${encodeURIComponent(tokenData.error_description || 'Authentication failed')}`,
					APP_URL
				)
			)
		}

		// Get user data
		const userResponse = await fetch('https://api.github.com/user', {
			headers: {
				Authorization: `Bearer ${tokenData.access_token}`,
				Accept: 'application/json'
			}
		})

		if (!userResponse.ok) {
			const errorText = await userResponse.text()
			console.error('User data fetch failed:', errorText)
			return NextResponse.redirect(
				new URL('/login?error=Failed to fetch user data', APP_URL)
			)
		}

		const userData: GithubUser = await userResponse.json()
		console.log('User data:', {
			id: userData.id,
			login: userData.login,
			hasName: !!userData.name
		})

		// Get user emails
		const emailsResponse = await fetch(
			'https://api.github.com/user/emails',
			{
				headers: {
					Authorization: `Bearer ${tokenData.access_token}`,
					Accept: 'application/json'
				}
			}
		)

		if (!emailsResponse.ok) {
			const errorText = await emailsResponse.text()
			console.error('Email fetch failed:', errorText)
			return NextResponse.redirect(
				new URL('/login?error=Failed to fetch user email', APP_URL)
			)
		}

		const emails: GithubEmail[] = await emailsResponse.json()
		const primaryEmail = emails.find(
			(email) => email.primary && email.verified
		)?.email

		if (!primaryEmail) {
			console.error('No verified email found:', emails)
			return NextResponse.redirect(
				new URL('/login?error=No verified email found', APP_URL)
			)
		}

		try {
			// Split name into first and last name
			const nameParts = userData.name?.split(' ') || []
			const firstName = nameParts[0] || userData.login
			const lastName = nameParts.slice(1).join(' ') || null

			const user = await prisma.user.upsert({
				where: { email: primaryEmail },
				update: {
					name: userData.name || userData.login,
					firstName,
					lastName,
					image: userData.avatar_url,
					provider: 'github',
					emailVerified: new Date()
				},
				create: {
					email: primaryEmail,
					name: userData.name || userData.login,
					firstName,
					lastName,
					image: userData.avatar_url,
					provider: 'github',
					password: null,
					emailVerified: new Date()
				}
			})

			console.log('User created/updated:', {
				id: user.id,
				email: user.email,
				provider: user.provider
			})

			// Create a new session
			const session = await prisma.session.create({
				data: {
					userId: user.id,
					expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 1 week from now
				}
			})

			// Create JWT with session info
			const token = await new SignJWT({
				userId: user.id,
				sessionToken: session.id,
				type: 'session'
			})
				.setProtectedHeader({ alg: 'HS256' })
				.setExpirationTime(session.expiresAt.getTime() / 1000)
				.sign(secretKey)

			// Clear the oauth state cookie
			;(await cookieStore).delete('github_oauth_state')

			// Set token cookie
			;(await cookieStore).set('token', token, {
				httpOnly: true,
				secure: process.env.NODE_ENV === 'production',
				sameSite: 'lax',
				path: '/',
				expires: session.expiresAt
			})

			return NextResponse.redirect(new URL('/dashboard', APP_URL))
		} catch (error) {
			console.error('Database error:', error)
			return NextResponse.redirect(
				new URL('/login?error=Failed to create user account', APP_URL)
			)
		}
	} catch (error) {
		console.error('Unhandled error:', error)
		return NextResponse.redirect(
			new URL('/login?error=Authentication failed', APP_URL)
		)
	}
}
