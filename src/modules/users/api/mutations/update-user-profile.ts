// src/modules/user/actions/update-user-profile.ts

import { db } from '@/server/db';
import { users } from '@/server/db/schemas';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { userUpdateSchema } from '../models/z.update-user';

export type UserUpdateData = z.infer<typeof userUpdateSchema>;

export async function updateUserProfile(userData: unknown) {
    try {
        const validatedData = userUpdateSchema.parse(userData);

        // Destructure validated data
        const { id, firstName, lastName, avatarUrl, avatarDeleted, email } =
            validatedData;

        let avatar: string | null | undefined = avatarUrl;
        let initials: string | null = null;

        if (avatarDeleted) {
            // Avatar was deleted, generate initials
            initials = `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();
            avatar = null; // Set avatar to null to remove the existing avatar
        }

        const updateValues: {
            firstName?: string;
            lastName?: string;
            avatar?: string | null;
            initials?: string | null;
            email?: string; // Include email in updateValues
            updatedAt: Date;
        } = {
            firstName: firstName,
            lastName: lastName,
            avatar: avatar,
            initials: initials,
            updatedAt: new Date(),
        };

        if (email) {
            updateValues.email = email;
        }

        // Update the user in the database
        const updatedUsers = await db
            .update(users)
            .set(updateValues)
            .where(eq(users.id, id))
            .returning({
                id: users.id,
                email: users.email,
                firstName: users.firstName,
                lastName: users.lastName,
                avatar: users.avatar,
            });

        if (updatedUsers.length === 0) {
            throw new Error('User not found or update failed');
        }

        return {
            success: true,
            user: updatedUsers[0],
        };
    } catch (error) {
        console.error('Error updating user profile:', error);
        return {
            success: false,
            error: (error as Error).message,
        };
    }
}
