import { db } from '@/server/db';
import { sessions } from '@/server/db/schemas';
import { verifyRefreshToken } from '@/shared/utils/jwt';
import { eq } from 'drizzle-orm';
import { cookies } from 'next/headers';

export async function logoutUser() {
    const cookieStore = cookies();
    const refreshToken = cookieStore.get('refresh_token')?.value;

    if (refreshToken) {
        try {
            // Verify token to get user ID
            const payload = await verifyRefreshToken(refreshToken);

            // Delete the session with this refresh token
            await db.delete(sessions)
                .where(eq(sessions.refreshToken, refreshToken));
        } catch (error) {
            // Continue even if token verification fails
            // We still want to clear cookies
        }
    }

    // Clear cookies regardless of token verification
    cookieStore.delete('access_token');
    cookieStore.delete('refresh_token');

    return { success: true };
} 