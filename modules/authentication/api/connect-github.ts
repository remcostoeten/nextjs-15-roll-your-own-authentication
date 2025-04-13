'use server'

import { db } from '@/server/db'
import { redirect } from 'next/navigation'
import { getCurrentUser } from '../utilities/auth'
import { generateToken } from '../utilities/auth'

export async function connectGithub() {
	const user = await getCurrentUser()

	if (!user) {
		redirect('/login')
	}

	// Generate a state token for OAuth security
	const state = await generateToken({
		id: user.id,
		email: user.email,
		firstName: user.firstName,
		lastName: user.lastName,
		isAdmin: user.isAdmin,
		sessionId: user.sessionId,
	})

	// Store the state in the database for verification
	await db.insert('oauth_states').values({
		state,
		userId: user.id,
		expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes
	})

	// Redirect to GitHub OAuth
	const githubAuthUrl = new URL('https://github.com/login/oauth/authorize')
	githubAuthUrl.searchParams.append(
		'client_id',
		process.env.GITHUB_CLIENT_ID!
	)
	githubAuthUrl.searchParams.append(
		'redirect_uri',
		`${process.env.NEXT_PUBLIC_APP_URL}/api/oauth/callback`
	)
	githubAuthUrl.searchParams.append('state', state)
	githubAuthUrl.searchParams.append('scope', 'read:user user:email')

	redirect(githubAuthUrl.toString())
}
