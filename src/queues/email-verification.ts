import {
	createEmailVerificationToken,
	sendVerificationEmail
} from '../services/auth/email-verification'

export async function queueEmailVerification(userId: number, email: string) {
	// In a real-world scenario, you would use a proper queue system like Redis or RabbitMQ
	// For simplicity, we're just calling the functions directly
	const verificationToken = await createEmailVerificationToken(userId)
	await sendVerificationEmail(email, verificationToken)
}
