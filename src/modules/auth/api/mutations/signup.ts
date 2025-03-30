"use server";

import { hash } from "bcryptjs";
import { db } from "db";
import { usersSchema } from "@/server/db/schemas/users";
import { eq } from "drizzle-orm";
import { createSession } from "@/modules/auth/session/create";
import { redirect } from "next/navigation";
import { env } from "env";
  import type { TAuthResult } from "../models/types";
import { DEFAULT_AVATAR_URL } from "@/core/config/constants";

export async function signup(formData: FormData): Promise<TAuthResult> {
  try {
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const avatarUrl = DEFAULT_AVATAR_URL();

    if (!name || !email || !password) {
      return {
        success: false,
        error: {
          code: "ALL_FIELDS_REQUIRED",
          message: "All fields are required",
        },
      };
    }

    const existingUser = await db.query.usersSchema.findFirst({
      where: eq(usersSchema.email, email.toLowerCase()),
    });

    if (existingUser) {
      return {
        success: false,
        error: {
          code: "EMAIL_IN_USE",
          message: "Email already in use",
        },
      };
    }

    if (password.length < (env.PASSWORD_LENGTH as number)) {
      return {
        success: false,
        error: {
          code: "PASSWORD_TOO_SHORT",
          message: "Password must be at least 8 characters long",
        },
      };
    }

    const hashedPassword = await hash(password, 10);

    const [user] = await db
      .insert(usersSchema)
      .values({
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
        role: email === process.env.ADMIN_EMAIL ? "admin" : "user",
        avatarUrl,
      })
      .returning();

    await createSession(user.id);

    redirect("/dashboard");
  } catch (error) {
    console.error("Signup error:", error);
    return {
      success: false,
      error: {
        code: "SERVER_ERROR",
        message: "An error occurred during signup",
      },
    };
  }
}
