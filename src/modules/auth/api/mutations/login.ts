export * from "./login";
export * from "./logout";
export * from "./signup";
export * from "./update-profile";
export * from "./delete-account";
export * from "./github-auth";
export * from "./create-notification";

import { createSession } from "@/modules/auth/session/create";
import { setSessionCookie } from "@/modules/auth/utils/cookies";
import type { TAuthResult } from "../models/types";
import { redirect } from "next/navigation";
import { LoginFormSchema } from "../models/forms/login";
import { db } from "@/server/db";
import { usersSchema } from "@/server/db/schemas/users";
import { eq } from "drizzle-orm";
import { compare } from "bcrypt";

export async function login(formData: FormData): Promise<TAuthResult> {
  try {
    const email = formData.get("email");
    const password = formData.get("password");

    if (!email || !password) {
      return {
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "Email and password are required",
          errors: {
            email: !email ? ["Email is required"] : [],
            password: !password ? ["Password is required"] : [],
          },
        },
      };
    }

    const validatedData = LoginFormSchema.safeParse({ email, password });

    if (!validatedData.success) {
      return {
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "Invalid form data",
          errors: validatedData.error.formErrors.fieldErrors,
        },
      };
    }

    const user = await db.query.usersSchema.findFirst({
      where: eq(usersSchema.email, validatedData.data.email.toLowerCase()),
    });

    if (!user) {
      return {
        success: false,
        error: {
          code: "INVALID_CREDENTIALS",
          message: "Invalid credentials",
        },
      };
    }

    // Check if user is an OAuth user
    if (user.authProvider === "github") {
      return {
        success: false,
        error: {
          code: "OAUTH_USER",
          message: "Please sign in with GitHub",
        },
      };
    }

    // Ensure password exists for local users
    if (!user.password) {
      return {
        success: false,
        error: {
          code: "SERVER_ERROR",
          message: "Invalid user account state",
        },
      };
    }

    const isValidPassword = await compare(validatedData.data.password, user.password);

    if (!isValidPassword) {
      return {
        success: false,
        error: {
          code: "INVALID_CREDENTIALS",
          message: "Invalid credentials",
        },
      };
    }

    const session = await createSession(user.id);
    await setSessionCookie(session);

    const { password: _, ...userWithoutPassword } = user;

    return {
      success: true,
      user: userWithoutPassword,
    };
  } catch (error) {
    console.error("Login error:", error);
    return {
      success: false,
      error: {
        code: "SERVER_ERROR",
        message: "An error occurred during login",
      },
    };
  }
}
