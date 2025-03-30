"use server";

import { cookies } from "next/headers";
import { db } from "db";
import { sessionsSchema } from "@/src/server/db/schema";
import { eq, gt, and } from "drizzle-orm";

export async function getSession() {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("session_token")?.value;

    if (!sessionToken) {
      return null;
    }

    const session = await db.query.sessionsSchema.findFirst({
      where: and(
        eq(sessionsSchema.id, parseInt(sessionToken)),
        gt(sessionsSchema.expiresAt, new Date())
      ),
    });

    return session;
  } catch (error) {
    console.error("Error getting session:", error);
    return null;
  }
} 