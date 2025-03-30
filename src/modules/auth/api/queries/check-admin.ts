"use server";

import { db } from "db";
import { users } from "@/server/db/schema";
import { eq } from "drizzle-orm";

export async function checkIsAdmin(userId: string) {
  try {
    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
    });

    return { success: true, isAdmin: user?.role === "ADMIN" };
  } catch (error) {
    console.error("Error checking admin status:", error);
    return { success: false, isAdmin: false };
  }
} 