export { getUserById as getUser, getUserByEmail, getAllUsers } from "./users";
export { getNotifications } from "./notifications";
export { checkIsAdmin } from "./check-admin";

import { db } from "db";
import { eq } from "drizzle-orm";
import { verifySession } from "../../session";
import { usersSchema } from "@/server/db/schemas/users";

export async function getProfile() {
  const session = await verifySession();

  if (!session) {
    throw new Error("Not authenticated");
  }

  const user = await db.query.usersSchema.findFirst({
    where: eq(usersSchema.id, session.userId),
    columns: {
      id: true,
      name: true,
      email: true,
      avatarUrl: true,
      bio: true,
      location: true,
      website: true,
      twitter: true,
      github: true,
      authProvider: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  return user;
}

export async function getPublicProfile(userId: number) {
  const user = await db.query.usersSchema.findFirst({
    where: eq(usersSchema.id, userId),
    columns: {
      id: true,
      name: true,
      avatarUrl: true,
      bio: true,
      location: true,
      website: true,
      twitter: true,
      github: true,
      createdAt: true,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  return user;
} 