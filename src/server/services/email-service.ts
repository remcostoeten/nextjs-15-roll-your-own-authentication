'use server'

import { featureFlags } from '@/config/features'
import { db } from '@/server/db'
import { emailVerifications, users } from '@/server/db/schema'
import { eq } from 'drizzle-orm'
import nodemailer from 'nodemailer'
import { v4 as uuidv4 } from 'uuid'

// Create reusable transporter
const transporter = nodemailer.createTransport({
	host: 'smtp.gmail.com',
	port: 587,
	secure: false,
	auth: {
		user: process.env.EMAIL_USER,
		pass: process.env.EMAIL_PASSWORD // App-specific password
	}
})

export type EmailServiceResponse = {
	success: boolean
	message: string
}

/**
 * Sends verification email using nodemailer
 * @author remcostoeten
 */
export async function sendVerificationEmail(
	userId: number,
	userEmail: string
): Promise<EmailServiceResponse> {
	// Early return if email verification is disabled
	if (!featureFlags.emailVerification) {
		return {
			success: true,
			message: 'Email verification is disabled'
		}
	}

	try {
		const token = uuidv4()
		const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours

		// Store verification token
		await db.insert(emailVerifications).values({
			userId,
			token,
			expiresAt
		})

		// Send email
		await transporter.sendMail({
			from: process.env.EMAIL_USER,
			to: userEmail,
			subject: 'Verify your email',
			html: `
				<h1>Verify your email</h1>
				<p>Click the link below to verify your email:</p>
				<a href="${process.env.NEXT_PUBLIC_APP_URL}/verify-email?token=${token}">
					Verify Email
				</a>
			`
		})

		return {
			success: true,
			message: 'Verification email sent successfully'
		}
	} catch (error) {
		console.error('Failed to send verification email:', error)
		return {
			success: false,
			message: 'Failed to send verification email'
		}
	}
}

/**
 * Verifies email token and updates user status
 * @author remcostoeten
 */
export async function verifyEmail(
	token: string
): Promise<EmailServiceResponse> {
	// Early return if email verification is disabled
	if (!featureFlags.emailVerification) {
		return {
			success: true,
			message: 'Email verification is disabled'
		}
	}

	if (!token) {
		return { success: false, message: 'No verification token provided' }
	}

	try {
		const verification = await db.query.emailVerifications.findFirst({
			where: (verifications, { eq }) => eq(verifications.token, token)
		})

		if (!verification) {
			return { success: false, message: 'Invalid verification token' }
		}

		if (verification.expiresAt < new Date()) {
			return { success: false, message: 'Verification token has expired' }
		}

		await db.transaction(async (tx) => {
			await tx
				.update(users)
				.set({ emailVerified: true })
				.where(eq(users.id, verification.userId))

			await tx
				.delete(emailVerifications)
				.where(eq(emailVerifications.token, token))
		})

		return { success: true, message: 'Email verified successfully' }
	} catch (error) {
		console.error('Failed to verify email:', error)
		return { success: false, message: 'Failed to verify email' }
	}
}
