import { db } from 'db';
import { userSchema } from '../schemas/z.user';
import { getSession } from '../services/session';

export async function getCurrentUser() {
    'use server';
    
    try {
        const session = await getSession();
        if (!session?.userId) return null;

        const user = await db.query.users.findFirst({
            where: (users, { eq }) => eq(users.id, session.userId)
        });

        if (!user) return null;

        const validatedUser = userSchema.parse(user);
        return validatedUser;
    } catch (error) {
        console.error('Error fetching user:', error);
        return null;
    }
} 