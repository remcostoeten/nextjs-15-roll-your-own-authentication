'use server';

import { users } from '@/api/db/schema';
import { db } from 'db';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { hashPassword, verifyPassword } from '../../helpers/hash-password';
import { getSession } from '../../helpers/session';

const updateProfileSchema = z.object({
	email: z.string().email().optional(),
	currentPassword: z.string().min(1).optional(),
	newPassword: z.string().min(8).optional(),
	name: z.string().min(2).optional(),
	avatar: z.string().url().optional(),
});

export type UpdateProfileData = z.infer<typeof updateProfileSchema>;

export async function updateProfile(formData: FormData) {
	const session = await getSession();
	if (!session) {
		throw new Error('Not authenticated');
	}

	const rawData: UpdateProfileData = {
		email: formData.get('email')?.toString(),
		currentPassword: formData.get('currentPassword')?.toString(),
		newPassword: formData.get('newPassword')?.toString(),
		name: formData.get('name')?.toString(),
		avatar: formData.get('avatar')?.toString(),
	};

	// Remove undefined values
	const data: Partial<UpdateProfileData & { password: string }> = Object.fromEntries(
		Object.entries(rawData).filter(([_, v]) => v !== undefined)
	);

	try {
		// Validate the data
		updateProfileSchema.parse(data);

		// Get current user
		const [user] = await db.select().from(users).where(eq(users.id, session.id));

		if (!user) {
			throw new Error('User not found');
		}

		// If changing password, verify current password
		if (data.newPassword) {
			if (!data.currentPassword) {
				throw new Error('Current password is required to set new password');
			}

			const isValid = await verifyPassword(data.currentPassword, user.password);
			if (!isValid) {
				throw new Error('Current password is incorrect');
			}

			data.password = await hashPassword(data.newPassword);
		}

		// Remove password-related fields from the update
		data.currentPassword = undefined;
		data.newPassword = undefined;

		// Update user
		const [updated] = await db
			.update(users)
			.set(data)
			.where(eq(users.id, session.id))
			.returning({
				id: users.id,
				email: users.email,
				role: users.role,
				name: users.name,
				avatar: users.avatar,
			});

		return { success: true, user: updated };
	} catch (error) {
		if (error instanceof z.ZodError) {
			throw new Error(error.errors[0].message);
		}
		throw error;
	}
}
