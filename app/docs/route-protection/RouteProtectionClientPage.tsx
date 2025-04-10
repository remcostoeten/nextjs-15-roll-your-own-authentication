'use client'

import { CodeBlock, CodeTabs } from '@/modules/docs/components/docs-code-block'

export default function RouteProtectionClientPage() {
	return (
		<div className="space-y-6">
			<div>
				<h1 className="scroll-m-20 text-4xl font-bold tracking-tight">
					Route Protection
				</h1>
				<p className="mt-2 text-xl text-muted-foreground">
					Protect routes and pages from unauthorized access
				</p>
			</div>

			<div className="space-y-4">
				<h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight">
					Overview
				</h2>
				<p>
					Route protection is essential for securing your application
					and ensuring that only authenticated users can access
					certain pages or API endpoints. In our JWT authentication
					system, we provide several methods for protecting routes:
				</p>
				<ul className="my-6 ml-6 list-disc [&>li]:mt-2">
					<li>Middleware-based protection for multiple routes</li>
					<li>
						Component-level protection using{' '}
						<code>requireAuth</code> and <code>requireAdmin</code>
					</li>
					<li>API route protection</li>
					<li>Role-based access control</li>
				</ul>
			</div>

			<div className="space-y-4">
				<h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight">
					Middleware-based Protection
				</h2>
				<p>
					Next.js middleware allows you to run code before a request
					is completed. We use middleware to protect routes by
					checking if the user is authenticated before allowing access
					to protected pages:
				</p>
				<CodeBlock
					language="tsx"
					code={`import { NextResponse } from "next/server"
import { verifyToken } from "@/modules/authentication/lib/auth"
import type { NextRequest } from "next/server"

// Define protected routes that require authentication
const protectedRoutes = ["/dashboard", "/profile", "/settings"]

// Define public auth routes that should redirect to dashboard if already authenticated
const publicAuthRoutes = ["/login", "/register", "/"]

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value
  const pathname = request.nextUrl.pathname
  const searchParams = request.nextUrl.searchParams

  // Handle OAuth callback
  if (pathname === "/" && searchParams.has("code") && searchParams.has("state") && searchParams.has("provider")) {
    // Redirect to the callback handler
    const url = new URL("/api/oauth/callback", request.url)
    url.search = request.nextUrl.search
    return NextResponse.redirect(url)
  }

  // Verify token
  const payload = token ? await verifyToken(token) : null
  const isAuthenticated = !!payload

  // Redirect to login if trying to access a protected route without authentication
  if (protectedRoutes.some((route) => pathname === route || pathname.startsWith(\`\${route}/\`)) && !isAuthenticated) {
    const url = new URL("/login", request.url)
    url.searchParams.set("callbackUrl", pathname)
    return NextResponse.redirect(url)
  }

  // Redirect to dashboard if trying to access a public auth route while authenticated
  if (publicAuthRoutes.some((route) => pathname === route) && isAuthenticated) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return NextResponse.next()
}

// Configure middleware to run on specific paths
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     * - api (API routes, except for oauth)
     */
    "/((?!_next/static|_next/image|favicon.ico|public).*)",
    "/api/oauth/:path*",
  ],
}`}
					fileName="middleware.ts"
				/>
			</div>

			<div className="space-y-4">
				<h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight">
					Component-level Protection
				</h2>
				<p>
					For more granular control, you can protect individual pages
					or components using the <code>requireAuth</code> and{' '}
					<code>requireAdmin</code> functions:
				</p>
				<CodeTabs
					tabs={[
						{
							title: 'requireAuth',
							language: 'tsx',
							code: `import { requireAuth } from "@/modules/authentication/lib/auth"

export default async function ProfilePage() {
  // This will redirect to login if the user is not authenticated
  const user = await requireAuth()
  
  return (
    <div>
      <h1>Profile Page</h1>
      <p>Welcome, {user.firstName}!</p>
    </div>
  )
}`,
							fileName: 'app/profile/page.tsx',
						},
						{
							title: 'requireAdmin',
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
						{
							title: 'Layout Protection',
							language: 'tsx',
							code: `import { requireAuth } from "@/modules/authentication/lib/auth"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger
} from "@/components/ui/sidebar"
import { NotificationBell } from "@/modules/notifications/components/notification-bell"
import { WorkspaceSwitcher } from "@/modules/workspaces/components/workspace-switcher"

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  // Protect the entire layout and all its children
  await requireAuth()

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1">
        <header className="border-b border-border bg-card">
          <div className="container flex h-16 items-center px-4 sm:px-6">
            <div className="flex items-center gap-2">
              <WorkspaceSwitcher />
              <span className="font-medium ml-4">Dashboard</span>
            </div>

            <div className="ml-auto flex items-center gap-4">
              <NotificationBell />
            </div>
          </div>
        </header>

        <div className="flex-1">{children}</div>
      </div>
    </div>
  )
}`,
							fileName: 'app/dashboard/layout.tsx',
						},
					]}
				/>
			</div>

			<div className="space-y-4">
				<h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight">
					API Route Protection
				</h2>
				<p>
					Protect API routes by checking authentication in the route
					handler:
				</p>
				<CodeBlock
					language="tsx"
					code={`import { NextResponse } from "next/server"
import { getCurrentUser } from "@/modules/authentication/lib/auth"

export async function GET() {
  const user = await getCurrentUser()
  
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  
  // User is authenticated, proceed with the request
  return NextResponse.json({ user })
}

export async function POST(request: Request) {
  const user = await getCurrentUser()
  
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  
  // Parse request body
  const data = await request.json()
  
  // Process the request
  // ...
  
  return NextResponse.json({ success: true })
}`}
					fileName="app/api/protected/route.ts"
				/>
			</div>

			<div className="space-y-4">
				<h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight">
					Role-based Access Control
				</h2>
				<p>
					Implement role-based access control to restrict access based
					on user roles:
				</p>
				<CodeTabs
					tabs={[
						{
							title: 'Admin Check',
							language: 'tsx',
							code: `import { NextResponse } from "next/server"
import { getCurrentUser } from "@/modules/authentication/lib/auth"

export async function GET() {
  const user = await getCurrentUser()
  
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  
  // Check if user is an admin
  if (user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }
  
  // User is an admin, proceed with the request
  return NextResponse.json({ success: true })
}`,
							fileName: 'app/api/admin/route.ts',
						},
						{
							title: 'Custom Role Check',
							language: 'tsx',
							code: `import { NextResponse } from "next/server"
import { getCurrentUser } from "@/modules/authentication/lib/auth"
import { db } from "@/server/db"
import { workspaceMembers } from "@/server/db/schema"
import { eq, and } from "drizzle-orm"

export async function GET(
  request: Request,
  { params }: { params: { workspaceId: string } }
) {
  const user = await getCurrentUser()
  
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  
  const workspaceId = parseInt(params.workspaceId)
  
  // Check if user is a member of the workspace
  const [membership] = await db
    .select()
    .from(workspaceMembers)
    .where(and(
      eq(workspaceMembers.workspaceId, workspaceId),
      eq(workspaceMembers.userId, user.id)
    ))
    .limit(1)
  
  if (!membership) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }
  
  // Check if user has the required role
  if (membership.role !== "owner" && membership.role !== "admin") {
    return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 })
  }
  
  // User has the required role, proceed with the request
  return NextResponse.json({ success: true })
}`,
							fileName:
								'app/api/workspaces/[workspaceId]/settings/route.ts',
						},
					]}
				/>
			</div>

			<div className="space-y-4">
				<h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight">
					Client-side Protection
				</h2>
				<p>
					Implement client-side protection to hide UI elements based
					on authentication status:
				</p>
				<CodeBlock
					language="tsx"
					code={`"use client"

import { useUser } from "@/hooks/use-user"
import { Button } from "@/components/ui/button"

export function ProtectedButton() {
  const { user, loading } = useUser()
  
  if (loading) {
    return <Button disabled>Loading...</Button>
  }
  
  if (!user) {
    return null // Don't render the button for unauthenticated users
  }
  
  // Only render for authenticated users
  return <Button>Protected Action</Button>
}

export function AdminButton() {
  const { user, loading } = useUser()
  
  if (loading) {
    return <Button disabled>Loading...</Button>
  }
  
  if (!user || user.role !== "admin") {
    return null // Don't render the button for non-admin users
  }
  
  // Only render for admin users
  return <Button>Admin Action</Button>
}`}
					fileName="components/protected-buttons.tsx"
				/>
			</div>

			<div className="space-y-4">
				<h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight">
					Protecting Server Actions
				</h2>
				<p>
					Protect server actions by checking authentication at the
					beginning of the action:
				</p>
				<CodeBlock
					language="tsx"
					code={`"use server"

import { getCurrentUser } from "@/modules/authentication/lib/auth"
import { db } from "@/server/db"
import { tasks } from "@/server/db/schema"
import { eq, and } from "drizzle-orm"
import { revalidatePath } from "next/cache"

export async function createTask(formData: FormData) {
  const user = await getCurrentUser()
  
  if (!user) {
    return { error: "Unauthorized" }
  }
  
  const title = formData.get("title") as string
  const description = formData.get("description") as string
  const workspaceId = parseInt(formData.get("workspaceId") as string)
  
  if (!title) {
    return { error: "Title is required" }
  }
  
  try {
    const [task] = await db
      .insert(tasks)
      .values({
        title,
        description,
        workspaceId,
        status: "todo",
        priority: "medium",
        createdById: user.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning()
    
    revalidatePath(\`/workspaces/\${workspaceId}\`)
    return { success: true, taskId: task.id }
  } catch (error) {
    console.error("Create task error:", error)
    return { error: "Failed to create task" }
  }
}`}
					fileName="app/api/tasks/actions.ts"
				/>
			</div>

			<div className="space-y-4">
				<h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight">
					Best Practices
				</h2>
				<p>Follow these best practices for route protection:</p>
				<ul className="my-6 ml-6 list-disc [&>li]:mt-2">
					<li>
						Always check authentication on both the client and
						server sides
					</li>
					<li>
						Use middleware for broad protection of multiple routes
					</li>
					<li>
						Use component-level protection for more granular control
					</li>
					<li>
						Implement role-based access control for different user
						types
					</li>
					<li>
						Always validate permissions when accessing resources
						owned by users
					</li>
					<li>
						Use HTTP status codes correctly (401 for unauthorized,
						403 for forbidden)
					</li>
					<li>
						Provide clear error messages for authentication failures
					</li>
					<li>Implement proper redirection after authentication</li>
					<li>Regularly audit your protection mechanisms</li>
				</ul>
			</div>
		</div>
	)
}
