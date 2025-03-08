import { Resend } from 'resend';
import { env } from './env';

// Initialize the Resend client if API key is available
const resend = env.RESEND_API_KEY ? new Resend(env.RESEND_API_KEY) : null;

type EmailOptions = {
    to: string | string[];
    subject: string;
    html: string;
    from?: string;
    replyTo?: string;
    cc?: string | string[];
    bcc?: string | string[];
};

/**
 * Send an email using Resend
 */
export async function sendEmail({
    to,
    subject,
    html,
    from = env.EMAIL_FROM || 'onboarding@resend.dev',
    replyTo,
    cc,
    bcc,
}: EmailOptions) {
    if (!resend) {
        console.warn('Resend API key not configured. Email not sent.');
        return { success: false, error: 'Resend API key not configured' };
    }

    try {
        const { data, error } = await resend.emails.send({
            from,
            to,
            subject,
            html,
            replyTo,
            cc,
            bcc,
        });

        if (error) {
            console.error('Error sending email:', error);
            throw new Error(`Failed to send email: ${error.message}`);
        }

        return { success: true, messageId: data?.id };
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
}

/**
 * Send a welcome email after registration
 */
export async function sendWelcomeEmail(email: string, firstName?: string) {
    const name = firstName || 'there';

    return sendEmail({
        to: email,
        subject: 'Welcome to Raioa!',
        html: `
      <div>
        <h1>Welcome to Raioa, ${name}!</h1>
        <p>Thank you for signing up. We're excited to have you on board.</p>
        <p>If you have any questions, feel free to reply to this email.</p>
      </div>
    `,
    });
}

/**
 * Send a password reset email
 */
export async function sendPasswordResetEmail(email: string, resetLink: string) {
    return sendEmail({
        to: email,
        subject: 'Reset Your Raioa Password',
        html: `
      <div>
        <h1>Reset Your Password</h1>
        <p>You requested a password reset. Click the link below to reset your password:</p>
        <p><a href="${resetLink}">Reset Password</a></p>
        <p>If you didn't request this, you can safely ignore this email.</p>
      </div>
    `,
    });
} 