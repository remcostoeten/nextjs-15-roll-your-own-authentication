'use server'

import { featureFlags } from '@/config/features'
import VerifyEmail from '@/emails/verify-email'
import { db } from '@/server/db'
import { emailVerifications, users } from '@/server/db/schema'
import { eq } from 'drizzle-orm'
import { Resend } from 'resend'
import { v4 as uuidv4 } from 'uuid'

const resend = new Resend(process.env.RESEND_API_KEY)

export type EmailServiceResponse = {
	success: boolean
	message: string
}

/**
 * Sends verification email using Resend with custom template
 * @author remcostoeten
 */
export async function sendVerificationEmail(
	userId: number,
	email: string
): Promise<EmailServiceResponse> {
	// Early return if email verification is disabled
	if (!featureFlags.emailVerification) {
		return {
			success: true,
			message: 'Email verification is disabled'
		}
	}

	try {
		// Log initial attempt
		console.log('\n🔵 Attempting to send verification email to:', email)

		const token = uuidv4()
		const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000)

		// Get user info for personalized email
		const user = await db.query.users.findFirst({
			where: eq(users.id, userId)
		})

		console.log('🔵 User found:', user ? 'Yes' : 'No')

		await db.insert(emailVerifications).values({
			userId,
			token,
			expiresAt
		})

		const verificationLink = `${process.env.NEXT_PUBLIC_APP_URL}/verify-email?token=${token}`

		// Log email configuration
		console.log('\n🔵 Email Configuration:')
		console.log('From:', process.env.RESEND_FROM_EMAIL)
		console.log('To:', email)
		console.log('Link:', verificationLink)

		const emailResponse = await resend.emails.send({
			from: `Auth System <${process.env.RESEND_FROM_EMAIL}>`,
			to: email,
			subject: 'Verify your email address',
			react: VerifyEmail({
				verificationLink,
				userName: user?.name || email.split('@')[0]
			})
		})

		// Log Resend response
		console.log('\n🔵 Resend Response:', emailResponse)

		return {
			success: true,
			message: 'Verification email sent successfully'
		}
	} catch (error) {
		// Detailed error logging
		console.error('\n🔴 Email Service Error:')
		console.error('Error details:', error)
		console.error(
			'Resend API Key configured:',
			!!process.env.RESEND_API_KEY
		)
		console.error('From email configured:', !!process.env.RESEND_FROM_EMAIL)
		console.error('App URL configured:', !!process.env.NEXT_PUBLIC_APP_URL)

		return { success: false, message: 'Failed to send verification email' }
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
