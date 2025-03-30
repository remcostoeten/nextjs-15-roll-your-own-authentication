"use server";

import { db } from "db";
import { usersSchema } from "@/server/db/schemas/users";
import { eq } from "drizzle-orm";
import bcryptjs from "bcryptjs";
import { revalidatePath } from "next/cache";
import { TProfileSchema, profileSchema } from "@/modules/auth/api/models/schemas";
import { verifySession } from "../../session";

export async function updateProfile(formData: FormData | TProfileSchema) {
  const session = await verifySession();

  if (!session) {
    throw new Error("Not authenticated");
  }

  // Parse and validate input data
  let data: TProfileSchema;
  try {
    if (formData instanceof FormData) {
      const rawData = Object.fromEntries(formData.entries());
      data = profileSchema.parse(rawData);
    } else {
      data = profileSchema.parse(formData);
    }
  } catch (error) {
    console.error("Validation error:", error);
    throw new Error("Invalid profile data");
  }

  // Get current user
  const user = await db.query.usersSchema.findFirst({
    where: eq(usersSchema.id, session.userId),
  });

  if (!user) {
    throw new Error("User not found");
  }

  // Check if email is being changed and if it's already taken
  if (data.email !== user.email) {
    const existingUser = await db.query.usersSchema.findFirst({
      where: eq(usersSchema.email, data.email),
    });

    if (existingUser) {
      throw new Error("Email is already taken");
    }
  }

  // Verify current password if provided
  if (data.currentPassword) {
    if (!user.password) {
      throw new Error("Cannot update password for OAuth accounts");
    }

    const isValid = await bcryptjs.compare(data.currentPassword, user.password);
    if (!isValid) {
      throw new Error("Current password is incorrect");
    }
  }

  // Prepare update data
  const updateData: Partial<typeof user> = {
    name: data.name,
    email: data.email,
    avatarUrl: data.avatarUrl,
    bio: data.bio,
    location: data.location,
    website: data.website,
    twitter: data.twitter,
    github: data.github,
    updatedAt: new Date(),
  };

  // Hash new password if provided
  if (data.newPassword) {
    if (!data.currentPassword) {
      throw new Error("Current password is required to set a new password");
    }
    updateData.password = await bcryptjs.hash(data.newPassword, 10);
  }

  try {
    // Update user profile
    await db
      .update(usersSchema)
      .set(updateData)
      .where(eq(usersSchema.id, session.userId));

    // Revalidate profile page
    revalidatePath("/dashboard/profile");
    
    return { success: true };
  } catch (error) {
    console.error("Error updating profile:", error);
    throw new Error("Failed to update profile");
  }
}
