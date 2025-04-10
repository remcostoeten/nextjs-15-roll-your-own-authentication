import { CodeBlock, CodeTabs } from '@/modules/docs/components/docs-code-block'
export default function ApiAuthenticationClientPage() {
	return (
		<div className="space-y-6">
			<div>
				<h1 className="scroll-m-20 text-4xl font-bold tracking-tight">
					API Authentication
				</h1>
				<p className="mt-2 text-xl text-muted-foreground">
					Learn how to authenticate API requests using JWT tokens
				</p>
			</div>

			<div className="space-y-4">
				<h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight">
					Overview
				</h2>
				<p>
					Our authentication system uses JSON Web Tokens (JWT) to
					authenticate API requests. JWTs are a compact, URL-safe
					means of representing claims to be transferred between two
					parties. The claims in a JWT are encoded as a JSON object
					that is used as the payload of a JSON Web Signature (JWS)
					structure, enabling the claims to be digitally signed.
				</p>
				<p>
					When a user logs in, a JWT is generated and returned to the
					client. This token should be included in the Authorization
					header of subsequent API requests to authenticate the user.
				</p>
			</div>

			<div className="space-y-4">
				<h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight">
					Authentication Flow
				</h2>
				<p>The authentication flow consists of the following steps:</p>
				<ol className="my-6 ml-6 list-decimal [&>li]:mt-2">
					<li>
						User logs in with their credentials (email/password or
						OAuth)
					</li>
					<li>
						Server validates the credentials and generates a JWT
					</li>
					<li>
						JWT is returned to the client and stored in an HTTP-only
						cookie
					</li>
					<li>Client includes the JWT in subsequent API requests</li>
					<li>
						Server validates the JWT and processes the request if
						valid
					</li>
				</ol>
			</div>

			<div className="space-y-4">
				<h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight">
					JWT Structure
				</h2>
				<p>A JWT consists of three parts separated by dots (.):</p>
				<ul className="my-6 ml-6 list-disc [&>li]:mt-2">
					<li>
						Header: Contains the token type and the signing
						algorithm
					</li>
					<li>
						Payload: Contains the claims (user data and metadata)
					</li>
					<li>
						Signature: Used to verify that the sender of the JWT is
						who it says it is
					</li>
				</ul>
				<p>Our JWT payload includes the following claims:</p>
				<CodeBlock
					language="json"
					code={`{
  "id": 123,
  "email": "user@example.com",
  "role": "user",
  "sessionId": "550e8400-e29b-41d4-a716-446655440000",
  "iat": 1516239022,
  "exp": 1516246222
}`}
				/>
			</div>

			<div className="space-y-4">
				<h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight">
					Authenticating API Requests
				</h2>
				<p>
					To authenticate API requests, include the JWT in the
					Authorization header of your HTTP requests:
				</p>
				<CodeBlock
					language="bash"
					code={`curl -X GET \\
  https://api.example.com/user/profile \\
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'`}
				/>
				<p>
					In our Next.js application, the JWT is automatically
					included in API requests via HTTP-only cookies, so you don't
					need to manually include it in the Authorization header.
				</p>
			</div>

			<div className="space-y-4">
				<h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight">
					Server-Side Authentication
				</h2>
				<p>
					On the server side, you can use the{' '}
					<code>getCurrentUser</code> function to get the
					authenticated user:
				</p>
				<CodeTabs
					tabs={[
						{
							title: 'Route Handler',
							language: 'tsx',
							code: `import { NextResponse } from "next/server"
import { getCurrentUser } from "@/modules/authentication/lib/auth"

export async function GET() {
  const user = await getCurrentUser()
  
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  
  // User is authenticated, proceed with the request
  return NextResponse.json({ user })
}`,
							fileName: 'app/api/user/route.ts',
						},
						{
							title: 'Server Component',
							language: 'tsx',
							code: `import { getCurrentUser } from "@/modules/authentication/lib/auth"
import { redirect } from "next/navigation"

export default async function ProtectedPage() {
  const user = await getCurrentUser()
  
  if (!user) {
    redirect("/login")
  }
  
  return (
    <div>
      <h1>Welcome, {user.firstName}!</h1>
      <p>Your email: {user.email}</p>
    </div>
  )
}`,
							fileName: 'app/protected/page.tsx',
						},
					]}
				/>
			</div>

			<div className="space-y-4">
				<h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight">
					Client-Side Authentication
				</h2>
				<p>
					On the client side, you can create a custom hook to get the
					authenticated user:
				</p>
				<CodeBlock
					language="tsx"
					code={`"use client"

import { useState, useEffect } from "react"

interface User {
  id: number
  email: string
  firstName: string
  lastName: string
  role: string
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
}
`}
					fileName="hooks/use-user.ts"
				/>
				<p>You can then use this hook in your client components:</p>
				<CodeBlock
					language="tsx"
					code={`"use client"

import { useUser } from "@/hooks/use-user"

export function Profile() {
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
      <p>Your email: {user.email}</p>
    </div>
  )
}
`}
					fileName="components/profile.tsx"
				/>
			</div>

			<div className="space-y-4">
				<h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight">
					Storage Integration Example
				</h2>
				<p>
					Here's an example of how to integrate storage with user
					authentication:
				</p>
				<CodeTabs
					tabs={[
						{
							title: 'Server Action',
							language: 'tsx',
							code: `"use server"

import { getCurrentUser } from "@/modules/authentication/lib/auth"
import { db } from "@/server/db"
import { storageItems } from "@/server/db/schema"
import { eq } from "drizzle-orm"

// Upload a file to storage and save metadata to the database
export async function uploadFile(formData: FormData) {
  const user = await getCurrentUser()
  
  if (!user) {
    return { error: "Unauthorized" }
  }
  
  const file = formData.get("file") as File
  
  if (!file) {
    return { error: "No file provided" }
  }
  
  try {
    // Upload file to storage (e.g., S3, Vercel Blob, etc.)
    // This is a placeholder for your actual storage upload logic
    const uploadResult = await uploadToStorage(file)
    
    // Save file metadata to the database
    const [storageItem] = await db
      .insert(storageItems)
      .values({
        userId: user.id,
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        storageUrl: uploadResult.url,
        createdAt: new Date(),
      })
      .returning()
    
    return { success: true, fileId: storageItem.id, url: uploadResult.url }
  } catch (error) {
    console.error("Upload error:", error)
    return { error: "Failed to upload file" }
  }
}

// Helper function to upload to storage (implementation depends on your storage provider)
async function uploadToStorage(file: File) {
  // This is a placeholder for your actual storage upload logic
  // Example with Vercel Blob:
  // const blob = await put(file.name, file, { access: 'authenticated' })
  // return { url: blob.url }
  
  // Mock implementation
  return { url: \`https://storage.example.com/\${file.name}\` }
}`,
							fileName: 'app/api/storage/actions.ts',
						},
						{
							title: 'Client Component',
							language: 'tsx',
							code: `"use client"

import { useState } from "react"
import { uploadFile } from "@/app/api/storage/actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"

export function FileUploader() {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null)
  const { toast } = useToast()

  async function handleSubmit(formData: FormData) {
    setIsUploading(true)
    
    try {
      const result = await uploadFile(formData)
      
      if (result.error) {
        toast({
          variant: "destructive",
          title: "Upload failed",
          description: result.error,
        })
      } else {
        toast({
          title: "File uploaded",
          description: "Your file has been uploaded successfully.",
        })
        setUploadedUrl(result.url)
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Something went wrong",
        description: "Please try again later.",
      })
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="space-y-4">
      <form action={handleSubmit} className="space-y-4">
        <Input
          type="file"
          name="file"
          required
          disabled={isUploading}
        />
        <Button type="submit" disabled={isUploading}>
          {isUploading ? "Uploading..." : "Upload File"}
        </Button>
      </form>
      
      {uploadedUrl && (
        <div className="mt-4">
          <p className="text-sm font-medium">File uploaded successfully:</p>
          <a
            href={uploadedUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-500 hover:underline"
          >
            {uploadedUrl}
          </a>
        </div>
      )}
    </div>
  )
}`,
							fileName: 'components/file-uploader.tsx',
						},
						{
							title: 'Database Schema',
							language: 'tsx',
							code: `import { relations } from "drizzle-orm"
import { pgTable, serial, text, varchar, timestamp, integer } from "drizzle-orm/pg-core"
import { users } from "./users"

// Storage items table
export const storageItems = pgTable("storage_items", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  fileName: varchar("file_name", { length: 255 }).notNull(),
  fileSize: integer("file_size").notNull(),
  fileType: varchar("file_type", { length: 100 }).notNull(),
  storageUrl: text("storage_url").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

// Define relations
export const storageItemsRelations = relations(storageItems, ({ one }) => ({
  user: one(users, {
    fields: [storageItems.userId],
    references: [users.id],
  }),
}))`,
							fileName: 'server/db/schema/storage.ts',
						},
					]}
				/>
			</div>

			<div className="space-y-4">
				<h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight">
					Route Protection
				</h2>
				<p>
					You can protect routes from unauthorized access using
					middleware or the <code>requireAuth</code> function:
				</p>
				<CodeTabs
					tabs={[
						{
							title: 'Middleware',
							language: 'tsx',
							code: `import { NextResponse } from "next/server"
import { verifyToken } from "@/modules/authentication/lib/auth"
import type { NextRequest } from "next/server"

// Define protected routes that require authentication
const protectedRoutes = ["/dashboard", "/profile", "/settings"]

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value
  const pathname = request.nextUrl.pathname

  // Check if the route is protected
  if (protectedRoutes.some((route) => pathname === route || pathname.startsWith(\`\${route}/\`))) {
    // Verify token
    const payload = token ? await verifyToken(token) : null
    const isAuthenticated = !!payload

    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      const url = new URL("/login", request.url)
      url.searchParams.set("callbackUrl", pathname)
      return NextResponse.redirect(url)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|public).*)",
  ],
}`,
							fileName: 'middleware.ts',
						},
						{
							title: 'Server Component',
							language: 'tsx',
							code: `import { requireAuth } from "@/modules/authentication/lib/auth"

export default async function ProtectedPage() {
  // This will redirect to login if the user is not authenticated
  const user = await requireAuth()
  
  return (
    <div>
      <h1>Protected Page</h1>
      <p>Welcome, {user.firstName}!</p>
    </div>
  )
}`,
							fileName: 'app/protected/page.tsx',
						},
						{
							title: 'Admin Protection',
							language: 'tsx',
							code: `import { requireAdmin } from "@/modules/authentication/lib/auth"

export default async function AdminPage() {
  // This will redirect to login if the user is not an admin
  const admin = await requireAdmin()
  
  return (
    <div>
      <h1>Admin Page</h1>
      <p>Welcome, Admin {admin.firstName}!</p>
    </div>
  )
}`,
							fileName: 'app/admin/page.tsx',
						},
					]}
				/>
			</div>

			<div className="space-y-4">
				<h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight">
					Database Relations
				</h2>
				<p>Here's how user data relates to other database tables:</p>
				<CodeBlock
					language="tsx"
					code={`// Define relations
export const usersRelations = relations(users, ({ many }) => ({
  sessions: many(sessions),
  activities: many(userActivities),
  notifications: many(userNotifications),
  createdNotifications: many(notifications, { relationName: "creator" }),
  workspaces: many(workspaceMembers),
  createdWorkspaces: many(workspaces, { relationName: "creator" }),
  assignedTasks: many(tasks, { relationName: "assignee" }),
  createdTasks: many(tasks, { relationName: "creator" }),
  oauthAccounts: many(oauthAccounts),
  storageItems: many(storageItems),
}))`}
					fileName="server/db/schema/relations.ts"
				/>
				<p>
					When querying related data, you can use Drizzle ORM's query
					builder:
				</p>
				<CodeBlock
					language="tsx"
					code={`"use server"

import { db } from "@/server/db"
import { users, storageItems } from "@/server/db/schema"
import { eq } from "drizzle-orm"
import { getCurrentUser } from "@/modules/authentication/lib/auth"

export async function getUserFiles() {
  const user = await getCurrentUser()
  
  if (!user) {
    return []
  }
  
  const files = await db.query.storageItems.findMany({
    where: eq(storageItems.userId, user.id),
    orderBy: [desc(storageItems.createdAt)],
  })
  
  return files
}`}
					fileName="app/api/storage/queries.ts"
				/>
			</div>

			<div className="space-y-4">
				<h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight">
					Security Best Practices
				</h2>
				<p>Follow these best practices to secure your application:</p>
				<ul className="my-6 ml-6 list-disc [&>li]:mt-2">
					<li>
						Use HTTP-only cookies to store JWTs to prevent XSS
						attacks
					</li>
					<li>
						Set the Secure flag on cookies in production to ensure
						they're only sent over HTTPS
					</li>
					<li>
						Implement CSRF protection for forms and API endpoints
					</li>
					<li>Use short-lived JWTs and implement token refresh</li>
					<li>Validate and sanitize all user input</li>
					<li>
						Implement rate limiting for authentication endpoints
					</li>
					<li>Use strong password hashing (bcrypt)</li>
					<li>
						Implement proper error handling to avoid leaking
						sensitive information
					</li>
					<li>Regularly audit and update dependencies</li>
				</ul>
			</div>
		</div>
	)
}
