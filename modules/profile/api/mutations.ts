"use server"

import { z } from "zod"
import { db } from "@/server/db"
import { users } from "@/server/db/schema"
import { eq } from "drizzle-orm"
import { getCurrentUser, logUserActivity } from "@/modules/authentication/utilities/auth"
import { revalidatePath } from "next/cache"

const personalInfoSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
})

export async function updatePersonalInfo(formData: FormData) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return { error: "Not authenticated" }
    }

    const data = {
      firstName: formData.get("firstName") as string,
      lastName: formData.get("lastName") as string,
    }

    const validatedData = personalInfoSchema.parse(data)

    await db
      .update(users)
      .set({
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
        updatedAt: new Date(),
      })
      .where(eq(users.id, user.id))

    await logUserActivity(user.id, "update_personal_info")

    revalidatePath("/profile")
    return { success: true }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: error.errors[0].message }
    }
    console.error("Update personal info error:", error)
    return { error: "Failed to update personal information" }
  }
}

const contactInfoSchema = z.object({
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
})

export async function updateContactInfo(formData: FormData) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return { error: "Not authenticated" }
    }

    const data = {
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
    }

    const validatedData = contactInfoSchema.parse(data)

    // Check if email is already in use by another user
    if (validatedData.email !== user.email) {
      const existingUser = await db.query.users.findFirst({
        where: eq(users.email, validatedData.email),
      })

      if (existingUser && existingUser.id !== user.id) {
        return { error: "Email is already in use" }
      }
    }

    await db
      .update(users)
      .set({
        email: validatedData.email,
        phone: validatedData.phone || null,
        updatedAt: new Date(),
      })
      .where(eq(users.id, user.id))

    await logUserActivity(user.id, "update_contact_info")

    revalidatePath("/profile")
    return { success: true }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: error.errors[0].message }
    }
    console.error("Update contact info error:", error)
    return { error: "Failed to update contact information" }
  }
}

const usernameSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
})

export async function updateUsername(formData: FormData) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return { error: "Not authenticated" }
    }

    const data = {
      username: formData.get("username") as string,
    }

    const validatedData = usernameSchema.parse(data)

    // Check if username is already in use
    if (validatedData.username !== user.username) {
      const existingUser = await db.query.users.findFirst({
        where: eq(users.username, validatedData.username),
      })

      if (existingUser) {
        return { error: "Username is already in use" }
      }
    }

    await db
      .update(users)
      .set({
        username: validatedData.username,
        updatedAt: new Date(),
      })
      .where(eq(users.id, user.id))

    await logUserActivity(user.id, "update_username")

    revalidatePath("/profile")
    return { success: true }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: error.errors[0].message }
    }
    console.error("Update username error:", error)
    return { error: "Failed to update username" }
  }
}

