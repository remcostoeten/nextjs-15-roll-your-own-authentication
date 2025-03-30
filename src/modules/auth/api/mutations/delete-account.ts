"use server";

import { db } from "db";
import { eq } from "drizzle-orm";
import { verifySession, deleteSession } from "../../session";
import { usersSchema } from "@/server/db/schemas/users";
import { redirect } from "next/navigation";
export async function deleteAccount() {
  const session = await verifySession();

  await db.delete(usersSchema).where(eq(usersSchema.id, session.userId));

  await deleteSession();

  redirect("/");
}
