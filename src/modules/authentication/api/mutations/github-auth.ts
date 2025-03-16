'use server'

import { cookies } from 'next/headers'
import { db } from '@/server/db'
import { users } from '@/server/db/schemas'
import { eq } from 'drizzle-orm'
import { generateTokens } from '@/shared/utils/jwt'
import { env } from 'env'
import { nanoid } from 'nanoid'

const GITHUB_CLIENT_ID = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET

export type GitHubAuthResponse = {
    success: boolean
    message?: string
    user?: {
        id: string
        email: string
        firstName: string | null
        lastName: string | null
        role: 'admin' | 'user'
    }
}

export async function githubAuthMutation(code: string): Promise<GitHubAuthResponse> {
    try {
        if (!GITHUB_CLIENT_ID || !GITHUB_CLIENT_SECRET) {
            return {
                success: false,
                message: 'GitHub OAuth is not configured',
            }
        }

        // Exchange code for access token
        const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
            body: JSON.stringify({
                client_id: GITHUB_CLIENT_ID,
                client_secret: GITHUB_CLIENT_SECRET,
                code,
            }),
        })

        const tokenData = await tokenResponse.json()

        if (tokenData.error) {
            console.error('GitHub token error:', tokenData.error)
            return {
                success: false,
                message: 'Failed to authenticate with GitHub',
            }
        }

        // Get user data from GitHub
        const userResponse = await fetch('https://api.github.com/user', {
            headers: {
                Authorization: `Bearer ${tokenData.access_token}`,
            },
        })

        const githubUser = await userResponse.json()

        // Get user email from GitHub
        const emailsResponse = await fetch('https://api.github.com/user/emails', {
            headers: {
                Authorization: `Bearer ${tokenData.access_token}`,
            },
        })

        const emails = await emailsResponse.json()
        const primaryEmail = emails.find((email: any) => email.primary)?.email

        if (!primaryEmail) {
            return {
                success: false,
                message: 'No primary email found in GitHub account',
            }
        }

        // Check if user exists
        let user = await db.query.users.findFirst({
            where: eq(users.email, primaryEmail.toLowerCase()),
        })

        if (!user) {
            // Create new user
            const [newUser] = await db
                .insert(users)
                .values({
                    id: nanoid(),
                    email: primaryEmail.toLowerCase(),
                    firstName: githubUser.name ? githubUser.name.split(' ')[0] : null,
                    lastName: githubUser.name ? githubUser.name.split(' ').slice(1).join(' ') : null,
                    role: primaryEmail.toLowerCase() === env.ADMIN_EMAIL?.toLowerCase() ? 'admin' : 'user',
                    githubId: githubUser.id.toString(),
                    githubAccessToken: tokenData.access_token,
                })
                .returning()

            user = newUser
        }

        // Generate tokens
        const tokenPayload = {
            sub: user.id,
            email: user.email,
            role: user.role as 'admin' | 'user',
            iat: Math.floor(Date.now() / 1000),
            exp: Math.floor(Date.now() / 1000) + 15 * 60, // 15 minutes
        }
        const tokens = await generateTokens(tokenPayload)

        // Set cookies
        const cookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax' as const,
            path: '/',
        }

        const cookieStore = await cookies()
        cookieStore.set('access_token', tokens.accessToken, {
            ...cookieOptions,
            maxAge: 15 * 60, // 15 minutes
        })

        cookieStore.set('refresh_token', tokens.refreshToken, {
            ...cookieOptions,
            maxAge: 7 * 24 * 60 * 60, // 7 days
        })

        return {
            success: true,
            message: 'Successfully authenticated with GitHub',
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role as 'admin' | 'user',
            },
        }
    } catch (error) {
        console.error('GitHub auth error:', error)
        return {
            success: false,
            message: error instanceof Error ? error.message : 'Failed to authenticate with GitHub',
        }
    }
} 