'use client'

import { CodeBlock, CodeTabs } from '@/modules/docs/components/docs-code-block'
export default function UserDataClientPage() {
	return (
		<div className="space-y-6">
			<div>
				<h1 className="scroll-m-20 text-4xl font-bold tracking-tight">
					User Data
				</h1>
				<p className="mt-2 text-xl text-muted-foreground">
					Access user data on the server and client side
				</p>
			</div>

			<div className="space-y-4">
				<h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight">
					User Data Structure
				</h2>
				<p>
					The user data structure is defined in the database schema:
				</p>
				<CodeBlock
					language="tsx"
					code={`// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  username: varchar("username", { length: 255 }).notNull().unique(),
  firstName: varchar("first_name", { length: 255 }).notNull(),
  lastName: varchar("last_name", { length: 255 }).notNull(),
  password: varchar("password", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 20 }),
  role: varchar("role", { length: 20 }).default("user").notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})`}
					fileName="server/db/schema/users.ts"
				/>
				<p>The TypeScript type for a user is:</p>
				<CodeBlock
					language="tsx"
					code={`export type User = {
  id: number;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  password: string; // This is the hashed password, never expose this to the client
  phone: string | null;
  role: "user" | "admin";
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}`}
					fileName="server/db/types.ts"
				/>
			</div>

			<div className="space-y-4">
				<h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight">
					Accessing User Data on the Server
				</h2>
				<p>
					You can access user data on the server using the{' '}
					<code>getCurrentUser</code> or <code>requireAuth</code>{' '}
					functions:
				</p>
				<CodeTabs
					tabs={[
						{
							title: 'getCurrentUser',
							language: 'tsx',
							code: `import { getCurrentUser } from "@/modules/authentication/lib/auth"

export async function getUserProfile() {
  const user = await getCurrentUser()
  
  if (!user) {
    return null
  }
  
  // Never return the password to the client
  const { password, ...userWithoutPassword } = user
  
  return userWithoutPassword
}`,
							fileName: 'app/api/user/queries.ts',
						},
						{
							title: 'requireAuth',
							language: 'tsx',
							code: `import { requireAuth } from "@/modules/authentication/lib/auth"

export default async function ProfilePage() {
  // This will redirect to login if the user is not authenticated
  const user = await requireAuth()
  
  // User is guaranteed to be authenticated here
  return (
    <div>
      <h1>Welcome, {user.firstName}!</h1>
      <p>Your email: {user.email}</p>
    </div>
  )
}`,
							fileName: 'app/profile/page.tsx',
						},
					]}
				/>
			</div>

			<div className="space-y-4">
				<h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight">
					Accessing User Data on the Client
				</h2>
				<p>
					To access user data on the client, you can create a custom
					hook that fetches the user data from an API endpoint:
				</p>
				<CodeTabs
					tabs={[
						{
							title: 'API Route',
							language: 'tsx',
							code: `import { NextResponse } from "next/server"
import { getCurrentUser } from "@/modules/authentication/lib/auth"

export async function GET() {
  const user = await getCurrentUser()
  
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  
  // Never return the password to the client
  const { password, ...userWithoutPassword } = user
  
  return NextResponse.json({ user: userWithoutPassword })
}`,
							fileName: 'app/api/user/route.ts',
						},
						{
							title: 'useUser Hook',
							language: 'tsx',
							code: `"use client"

import { useState, useEffect } from "react"

interface User {
  id: number
  email: string
  username: string
  firstName: string
  lastName: string
  phone: string | null
  role: "user" | "admin"
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export function useUser() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function fetchUser() {
      try {
        const response = await fetch("/api/user")
        if (!response.ok) {
          throw new Error("Failed to fetch user")
        }
        const data = await response.json()
        setUser(data.user)
      } catch (err) {
        setError(err instanceof Error ? err : new Error(String(err)))
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [])

  return { user, loading, error }
}`,
							fileName: 'hooks/use-user.ts',
						},
						{
							title: 'Client Component',
							language: 'tsx',
							code: `"use client"

import { useUser } from "@/hooks/use-user"

export function UserProfile() {
  const { user, loading, error } = useUser()

  if (loading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>Error: {error.message}</div>
  }

  if (!user) {
    return <div>Not authenticated</div>
  }

  return (
    <div>
      <h1>Welcome, {user.firstName}!</h1>
      <p>Email: {user.email}</p>
      <p>Username: {user.username}</p>
      <p>Role: {user.role}</p>
    </div>
  )
}`,
							fileName: 'components/user-profile.tsx',
						},
					]}
				/>
			</div>

			<div className="space-y-4">
				<h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight">
					Updating User Data
				</h2>
				<p>You can update user data using server actions:</p>
				<CodeBlock
					language="tsx"
					code={`"use server"

import { z } from "zod"
import { db } from "@/server/db"
import { users } from "@/server/db/schema"
import { eq } from "drizzle-orm"
import { getCurrentUser, logUserActivity } from "@/modules/authentication/lib/auth"
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
}`}
					fileName="app/api/user/mutations.ts"
				/>
			</div>

			<div className="space-y-4">
				<h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight">
					User Sessions
				</h2>
				<p>
					User sessions are stored in the database and linked to the
					JWT token:
				</p>
				<CodeBlock
					language="tsx"
					code={`// Sessions table
export const sessions = pgTable("sessions", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  lastUsedAt: timestamp("last_used_at").defaultNow().notNull(),
  ipAddress: varchar("ip_address", { length: 45 }),
  userAgent: text("user_agent"),
})`}
					fileName="server/db/schema/sessions.ts"
				/>
				<p>
					When a user logs in, a new session is created and the
					session ID is included in the JWT payload. This allows you
					to invalidate sessions without having to change the JWT
					secret.
				</p>
			</div>

			<div className="space-y-4">
				<h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight">
					User Activities
				</h2>
				<p>User activities are logged in the database:</p>
				<CodeBlock
					language="tsx"
					code={`// User activities table
export const userActivities = pgTable("user_activities", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  action: varchar("action", { length: 255 }).notNull(),
  details: text("details"),
  ipAddress: varchar("ip_address", { length: 45 }),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
})`}
					fileName="server/db/schema/activities.ts"
				/>
				<p>
					You can log user activities using the{' '}
					<code>logUserActivity</code> function:
				</p>
				<CodeBlock
					language="tsx"
					code={`import { logUserActivity } from "@/modules/authentication/lib/auth"

// Log user activity
await logUserActivity(user.id, "update_profile", "Updated personal information")`}
				/>
			</div>
		</div>
	)
}
