"use server";

import { db } from "db";
import { desc, eq } from "drizzle-orm";
import { users } from "@/server/db/schema";

export async function getUserById(id: string) {
  return db.query.users.findFirst({
    where: eq(users.id, id),
  });
}

export async function getUserByEmail(email: string) {
  return db.query.users.findFirst({
    where: eq(users.email, email.toLowerCase()),
  });
}

export async function getAllUsers() {
  return db.query.users.findMany({
    orderBy: [desc(users.id)],
  });
} 