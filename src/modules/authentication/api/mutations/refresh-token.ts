import { db } from '@/server/db';
import { users, sessions } from '@/server/db/schemas';
import { verifyRefreshToken, generateTokens } from '@/shared/utils/jwt';
import { eq, and } from 'drizzle-orm';
import { cookies } from 'next/headers';

export async function refreshToken(requestInfo?: {
    userAgent?: string;
    ipAddress?: string;
}) {
    const cookieStore = cookies();
    const refreshToken = cookieStore.get('refresh_token')?.value;

    if (!refreshToken) {
        throw new Error('Refresh token is required');
    }

    try {
        // Verify the refresh token
        const payload = await verifyRefreshToken(refreshToken);

        // Find the session with this refresh token
        const session = await db.query.sessions.findFirst({
            where: eq(sessions.refreshToken, refreshToken),
            with: {
                user: true
            }
        });

        if (!session) {
            throw new Error('Invalid refresh token');
        }

        // Check if the token is expired
        if (new Date() > session.expiresAt) {
            // Delete the expired session
            await db.delete(sessions)
                .where(eq(sessions.id, session.id));

            throw new Error('Refresh token expired');
        }

        // Generate new tokens
        const tokens = await generateTokens({
            sub: payload.sub,
            email: payload.email,
        });

        // Calculate new expiration date
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7);

        // Delete the old session
        await db.delete(sessions)
            .where(eq(sessions.id, session.id));

        // Create a new session with the new refresh token
        await db.insert(sessions).values({
            userId: payload.sub,
            refreshToken: tokens.refreshToken,
            expiresAt,
            userAgent: requestInfo?.userAgent || session.userAgent,
            ipAddress: requestInfo?.ipAddress || session.ipAddress,
        });

        // Set new cookies
        cookieStore.set({
            name: 'access_token',
            value: tokens.accessToken,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 15 * 60, // 15 minutes
            path: '/',
        });

        cookieStore.set({
            name: 'refresh_token',
            value: tokens.refreshToken,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60, // 7 days
            path: '/',
        });

        // Find user details
        const user = await db.query.users.findFirst({
            where: eq(users.id, payload.sub),
            columns: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
            }
        });

        return {
            user,
            tokens,
        };

    } catch (error) {
        // Clear cookies if refresh fails
        cookieStore.delete('access_token');
        cookieStore.delete('refresh_token');

        throw error;
    }
} 