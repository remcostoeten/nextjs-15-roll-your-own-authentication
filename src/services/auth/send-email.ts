'use server'

import nodemailer from 'nodemailer'
import { Resend } from 'resend'
import { env } from '@/server/env'

type EmailOptions = {
	to: string
	subject: string
	text: string
	html?: string
}

// Only initialize Resend if API key is available
const resend = env.RESEND_API_KEY ? new Resend(env.RESEND_API_KEY) : null

// Only initialize nodemailer if SMTP settings are available
const transporter = env.SMTP_HOST ? nodemailer.createTransport({
	host: env.SMTP_HOST,
	port: Number(env.SMTP_PORT),
	secure: env.SMTP_SECURE === 'true',
	auth: {
		user: env.SMTP_USER,
		pass: env.SMTP_PASS
	}
}) : null

export async function sendEmail({ to, subject, text, html }: EmailOptions) {
	if (env.NODE_ENV === 'production') {
		if (!resend) {
			console.warn('Resend API key not configured, skipping email send')
			return
		}
		try {
			await resend.emails.send({
				from: env.SMTP_FROM || 'onboarding@resend.dev',
				to,
				subject,
				text,
				html
			})
		} catch (error) {
			console.error('Failed to send email with Resend:', error)
			throw new Error('Failed to send email')
		}
	} else {
		if (!transporter) {
			console.warn('SMTP not configured, skipping email send')
			return
		}
		try {
			await transporter.sendMail({
				from: env.SMTP_FROM,
				to,
				subject,
				text,
				html
			})
		} catch (error) {
			console.error('Failed to send email with Nodemailer:', error)
			throw new Error('Failed to send email')
		}
	}
}
