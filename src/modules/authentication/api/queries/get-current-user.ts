import { db } from '@/server/db';
import { users } from '@/server/db/schemas';
import { verifyAccessToken } from '@/shared/utils/jwt';
import { eq } from 'drizzle-orm';
import { cookies } from 'next/headers';

export async function getCurrentUser() {
    try {
        const cookieStore = cookies();
        const accessToken = cookieStore.get('access_token')?.value;

        if (!accessToken) {
            return null;
        }

        // Verify the access token
        const payload = await verifyAccessToken(accessToken);

        // Find the user
        const user = await db.query.users.findFirst({
            where: eq(users.id, payload.sub),
            columns: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                createdAt: true,
            }
        });

        if (!user) {
            return null;
        }

        return user;
    } catch (error) {
        // Token is invalid or expired
        return null;
    }
} 