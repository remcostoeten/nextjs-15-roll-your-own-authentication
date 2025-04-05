"use server"

import { cookies } from "next/headers"
import { z } from "zod"
import bcrypt from "bcryptjs"
import { db } from "@/server/db"
import { users, sessions, notifications, userNotifications } from "@/server/db/schema"
import { eq, or } from "drizzle-orm"
import { generateToken, logUserActivity, isFirstUser } from "../utilities/auth"
import { headers } from "next/headers"
import { v4 as uuidv4 } from "uuid"
import { createId } from "@paralleldrive/cuid2"

// Register validation schema
const registerSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(8, "Password must be at least 8 characters"),
})

// Login validation schema - updated to accept either email or username
const loginSchema = z.object({
  emailOrUsername: z.string().min(1, "Email or username is required"),
  password: z.string().min(1, "Password is required"),
})

const cookieOptions = {
  httpOnly: true,
  path: "/",
  secure: process.env.NODE_ENV === "production",
  maxAge: 7 * 24 * 60 * 60, // 7 days
}

// Register a new user
export async function register(formData: FormData) {
  try {
    // Validate form data
    const validatedData = registerSchema.parse({
      firstName: formData.get("firstName"),
      lastName: formData.get("lastName"),
      email: formData.get("email"),
      username: formData.get("username"),
      password: formData.get("password"),
    })

    // Check if email already exists
    const existingUserByEmail = await db.query.users.findFirst({
      where: eq(users.email, validatedData.email),
    })

    if (existingUserByEmail) {
      console.log("Registration failed: Email already in use", validatedData.email)
      return { error: "Email already in use" }
    }

    // Check if username already exists
    const existingUserByUsername = await db.query.users.findFirst({
      where: eq(users.username, validatedData.username),
    })

    if (existingUserByUsername) {
      console.log("Registration failed: Username already in use", validatedData.username)
      return { error: "Username already in use" }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(validatedData.password, 10)

    // Check if this is the first user (make them admin)
    const firstUser = await isFirstUser()
    const isAdmin = firstUser || validatedData.email === process.env.ADMIN_EMAIL

    // Create user
    const userId = createId()
    const [newUser] = await db
      .insert(users)
      .values({
        id: userId,
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
        email: validatedData.email,
        username: validatedData.username,
        password: hashedPassword,
        isAdmin: isAdmin,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning()

    // Log activity
    await logUserActivity(newUser.id, "register")

    // Create welcome notification
    const notificationId = createId()
    const [welcomeNotification] = await db
      .insert(notifications)
      .values({
        id: notificationId,
        title: "Welcome to the platform!",
        content: `Welcome ${newUser.firstName}! We're glad to have you here. Get started by exploring the features and completing your profile.`,
        type: "success",
        createdById: newUser.id, // Self-created welcome message
        isGlobal: false,
        createdAt: new Date(),
      })
      .returning()

    // Create user notification entry
    const userNotificationId = createId()
    await db.insert(userNotifications).values({
      id: userNotificationId,
      userId: newUser.id,
      notificationId: welcomeNotification.id,
      isRead: false,
      createdAt: new Date(),
    })

    console.log("Registration successful for user", newUser.id)
    return { success: true, userId: newUser.id }
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("Registration validation error:", error.errors)
      return { error: error.errors[0].message }
    }
    console.error("Registration error:", error)
    return { error: "Registration failed" }
  }
}

// Login user - updated to support login with email or username
export async function login(formData: FormData) {
  try {
    // Validate form data
    const validatedData = loginSchema.parse({
      emailOrUsername: formData.get("emailOrUsername"),
      password: formData.get("password"),
    })

    const { emailOrUsername, password } = validatedData
    console.log("Login attempt for:", emailOrUsername)

    // Find user by email or username
    const user = await db.query.users.findFirst({
      where: or(eq(users.email, emailOrUsername), eq(users.username, emailOrUsername)),
    })

    if (!user) {
      console.log("Login failed: User not found for", emailOrUsername)
      return { error: "Invalid credentials" }
    }

    // Check if user is active
    if (user.isVerified === false) {
      console.log("Login failed: User account is not verified", user.id)
      return { error: "Your account has not been verified. Please contact an administrator." }
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password || "")

    if (!isPasswordValid) {
      console.log("Login failed: Invalid password for user", user.id)
      return { error: "Invalid credentials" }
    }

    // Create session
    const headersList = headers()
    const userAgent = headersList.get("user-agent") || ""
    const ip = headersList.get("x-forwarded-for") || "127.0.0.1"

    const sessionId = uuidv4()
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 7) // 7 days from now

    await db.insert(sessions).values({
      id: sessionId,
      userId: user.id,
      expiresAt,
      ipAddress: ip.split(",")[0],
      userAgent,
      lastUsedAt: new Date(),
    })

    // Generate JWT token
    const token = await generateToken({
      id: user.id,
      email: user.email,
      isAdmin: user.isAdmin || false,
      sessionId,
    })

    console.log("Generated token for user", user.id)

    // Set token cookie
    cookies().set("token", token, {
      ...cookieOptions,
      expires: expiresAt,
    })

    // Log activity
    await logUserActivity(user.id, "login")

    console.log("Login successful for user", user.id)
    return { success: true }
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("Login validation error:", error.errors)
      return { error: error.errors[0].message }
    }
    console.error("Login error:", error)
    return { error: "Login failed" }
  }
}

// Logout user
export async function logout() {
  try {
    const token = cookies().get("token")?.value

    if (token) {
      cookies().delete("token")
    }

    return { success: true }
  } catch (error) {
    console.error("Logout error:", error)
    return { error: "Logout failed" }
  }
}

