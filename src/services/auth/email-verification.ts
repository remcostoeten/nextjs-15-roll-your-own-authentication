'use server'

import { randomBytes } from 'crypto'
import { eq } from 'drizzle-orm'
import { db } from '../../server/db/drizzle'
import { emailVerifications, users } from '../../server/db/schema'
import { sendEmail } from './send-email'

export async function createEmailVerificationToken(
	userId: number
): Promise<string> {
	const token = randomBytes(32).toString('hex')
	const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours

	await db.insert(emailVerifications).values({
		userId,
		token,
		expiresAt
	})

	return token
}

export async function sendVerificationEmail(email: string, token: string) {
	const verificationLink = `${process.env.NEXT_PUBLIC_APP_URL}/verify-email?token=${token}`

	await sendEmail({
		to: email,
		subject: 'Verify your email',
		text: `Click this link to verify your email: ${verificationLink}`,
		html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1>Verify your email</h1>
        <p>Click <a href="${verificationLink}">here</a> to verify your email.</p>
      </div>
    `
	})
}

export async function verifyEmail(token: string): Promise<boolean> {
	const now = new Date()

	const [verification] = await db
		.delete(emailVerifications)
		.where(eq(emailVerifications.token, token))
		.returning()

	if (!verification || verification.expiresAt < now) {
		return false
	}

	await db
		.update(users)
		.set({ emailVerified: true })
		.where(eq(users.id, verification.userId))

	return true
}
