import { db } from '@/api/db';
import { users, userProfiles } from '@/modules/auth/api/schemas';
import { Role } from '@/modules/auth/api/schemas/user-schema';
import { RegisterInput } from '@/modules/auth/api/models/auth.models';
import { eq, sql } from 'drizzle-orm';

export async function createUser(input: RegisterInput, hashedPasswordHash: string, role: Role) {
  try {
    const newUser = await db.transaction(async (tx) => {
      const [createdUser] = await tx
        .insert(users)
        .values({
          username: input.username,
          email: input.email.toLowerCase(),
          passwordHash: hashedPasswordHash,
          role: role,
        })
        .returning({
          id: users.id,
          username: users.username,
          email: users.email,
          role: users.role,
        });

      if (!createdUser) {
        throw new Error('Failed to create user.');
      }

      // Create user profile
      await tx.insert(userProfiles).values({
        userId: createdUser.id,
        biography: '',
        occupation: '',
        githubLink: '',
        twitterLink: '',
        websiteLink: '',
      });

      return createdUser;
    });

    return newUser;

  } catch (error: any) {
    console.error('Error creating user:', error);
    if (error.code === '23505') {
      if (error.constraint?.includes('email')) {
        throw new Error('Email address is already in use.');
      }
      if (error.constraint?.includes('username')) {
        throw new Error('Username is already taken.');
      }
    }
    throw new Error('Failed to register user.');
  }
}

export async function updateUserLoginStats(userId: number) {
  try {
    await db.update(userProfiles)
      .set({
        loginCount: sql`${userProfiles.loginCount} + 1`,
        lastLoginAt: new Date(),
      })
      .where(eq(userProfiles.userId, userId));
  } catch (error) {
    console.error(`Error updating login stats for user ${userId}:`, error);
  }
}
