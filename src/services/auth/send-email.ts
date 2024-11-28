'use server'

import nodemailer from 'nodemailer'
import { Resend } from 'resend'

type EmailOptions = {
	to: string
	subject: string
	text: string
	html?: string
}

const resend = new Resend(process.env.RESEND_API_KEY)

const transporter = nodemailer.createTransport({
	host: process.env.SMTP_HOST,
	port: Number(process.env.SMTP_PORT),
	secure: process.env.SMTP_SECURE === 'true',
	auth: {
		user: process.env.SMTP_USER,
		pass: process.env.SMTP_PASS
	}
})

export async function sendEmail({ to, subject, text, html }: EmailOptions) {
	if (process.env.NODE_ENV === 'production') {
		try {
			await resend.emails.send({
				from: process.env.SMTP_FROM || 'onboarding@resend.dev',
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
		try {
			await transporter.sendMail({
				from: process.env.SMTP_FROM,
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
