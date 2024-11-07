import { CodeBlock } from '@/shared/_docs/code-block/code-block'
import { withAdminProtection } from '@/shared/components/admin-protection'
import { isAdmin } from '@/shared/utilities/get-admin'
import { getUser } from '@/shared/utilities/get-user'
import { AlertCircle, Shield } from 'lucide-react'

const getUserCode = `
/**
 * Server-side utility to get the authenticated user
 * Use this in Server Components or Server Actions to:
 * - Check authentication status
 * - Get user data
 * - Protect routes
 * - Access user roles
 */
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import { SessionUser } from '@/features/auth/types';

const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'secret');

export async function getUser(): Promise<SessionUser | null> {
   const cookieStore = await cookies();
   const token = cookieStore.get('session')?.value;
   if (!token) return null;
   
   try {
       const { payload } = await jwtVerify(token, secret);
       return payload as SessionUser;
   } catch {
       return null;
   }
}
`

const adminProtectionCode = `
/**
 * Example of using admin protection
 * This shows how to:
 * 1. Check admin status
 * 2. Protect components
 * 3. Handle unauthorized access
 */
import { isAdmin, withAdminProtection } from '@/shared/utils/admin.server'

// Check if user is admin
const adminStatus = await isAdmin()

// Protect a component
{await withAdminProtection(
  AdminComponent,
  { prop: 'value' },
  <CustomFallback /> // Optional
)}

// Or use directly in JSX
{adminStatus ? (
  <AdminOnlyContent />
) : (
  <AccessDenied />
)}
`

// Admin-only component example
function AdminDashboard() {
	return (
		<div className="border border-purple-500/20 bg-purple-500/10 rounded-lg overflow-hidden">
			<div className="p-6">
				<h2 className="text-xl font-semibold flex items-center gap-2">
					<Shield className="h-5 w-5" />
					Admin Dashboard
				</h2>
				<p className="text-neutral-400">
					This content is only visible to administrators
				</p>
				<div className="mt-4 space-y-4">
					<p>Welcome to the admin dashboard!</p>
					<ul className="list-disc list-inside space-y-2">
						<li>Manage users</li>
						<li>View system logs</li>
						<li>Configure settings</li>
					</ul>
				</div>
			</div>
		</div>
	)
}

const userDataCode = `// Example of fetching user data in a Server Component
import { getUser } from '@/shared/utillities/get-user'

export default async function UserDataExample() {
  const user = await getUser()
  
  console.log(user) // to see the user data in the console
  
  return (
    <div>
      {user ? (
        <div>
          <p>Email: {user.email}</p>
          <p>Role: {user.role}</p>
          <p>User ID: {user.userId}</p>
        </div>
      ) : (
        <p>Not signed in</p>
      )}
    </div>
  )
}`

const adminCheckCode = `// Example of checking admin status
export default async function AdminCheck() {
  const adminStatus = await isAdmin()
  
  return (
    <div className={\`p-4 rounded-lg border \${
      adminStatus ? 'bg-neutral-900' : 'bg-red-500/10'
    }\`}>
      <p>
        You are {adminStatus ? 'an administrator' : 'not an administrator'}
      </p>
    </div>
  )
}`

const protectedComponentCode = `// Example of protecting a component with withAdminProtection
export default async function ProtectedPage() {
  return (
    {await withAdminProtection(
      AdminComponent,
      { /* props */ },
      <div>Access Denied</div> // Optional fallback
    )}
  )
}`

export default async function ServerAuthDemo() {
	const adminStatus = await isAdmin()
	const user = await getUser()

	return (
		<div className="max-w-4xl mx-auto p-6 space-y-8">
			<div className="space-y-2">
				<h1 className="text-3xl font-bold">
					Server-side Authentication Guide
				</h1>
				<p className="text-lg text-neutral-400">
					For server-side rendered pages we can not use the useUser
					hook as that involves client-side code. Thus we created{' '}
					<code>getUser</code> to fetch user data in server components
					which is basically the equivalent of useUser but then runs
					on the server.
				</p>
			</div>

			{/* User Data Section */}
			<div className="space-y-6">
				<h2 className="text-2xl font-semibold">
					1. User Data Fetching
				</h2>
				<p className="text-neutral-400">
					Fetch authenticated user data directly in your Server
					Components:
				</p>

				{/* Live Demo */}
				<div className="border border-neutral-800 rounded-lg p-6 space-y-4">
					<h3 className="text-lg font-semibold">Demo</h3>
					{user ? (
						<div className="space-y-2">
							<p>
								<span className="font-medium">Email:</span>{' '}
								{user.email}
							</p>
							<p>
								<span className="font-medium">Role:</span>{' '}
								{user.role}
							</p>
							<p>
								<span className="font-medium">User ID:</span>{' '}
								{user.userId}
							</p>
						</div>
					) : (
						<p className="text-neutral-400">Not signed in</p>
					)}
				</div>

				<div>
					<h3 className="text-lg font-medium mb-2">Implementation</h3>
					<CodeBlock
						code={userDataCode}
						language="typescript"
						fileName="user-data-example.tsx"
						showLineNumbers
						enableLineHighlight
						showMetaInfo
					/>
				</div>
			</div>

			{/* Admin Check Section */}
			<div className="space-y-6">
				<h2 className="text-2xl font-semibold">
					2. Admin Status Check
				</h2>
				<p className="text-neutral-400">
					Just like for user data there is a utility to check if the
					current user is an administrator: <code>isAdmin</code>.
				</p>

				{/* Live Demo */}
				<div
					className={`p-4 rounded-lg border ${
						adminStatus
							? 'bg-neutral-900 border-neutral-800'
							: 'bg-red-500/10 border-red-500/20'
					}`}
				>
					<div className="flex items-center gap-2">
						<AlertCircle className="h-4 w-4" />
						<h3 className="font-medium">Admin Status Check</h3>
					</div>
					<p className="mt-1 text-neutral-400">
						You are{' '}
						{adminStatus
							? 'an administrator'
							: 'not an administrator'}
					</p>
				</div>

				{/* Implementation */}
				<div>
					<h3 className="text-lg font-medium mb-2">Implementation</h3>
					<CodeBlock
						code={adminCheckCode}
						language="typescript"
						fileName="admin-check-example.tsx"
						showLineNumbers
						enableLineHighlight
						showMetaInfo
					/>
				</div>
			</div>

			{/* Protected Component Section */}
			<div className="space-y-6">
				<h2 className="text-2xl font-semibold">
					3. Protected Components
				</h2>
				<p className="text-neutral-400">
					Protect components from non-admin access:
				</p>

				{/* Live Demo */}
				<div className="space-y-2">
					<h3 className="text-lg font-medium">Live Demo</h3>
					<p className="text-neutral-400 mb-4">
						This component is only visible to administrators:
					</p>
					{await withAdminProtection(
						AdminDashboard,
						{},
						<div className="border border-red-500/20 rounded-lg overflow-hidden">
							<div className="p-6">
								<h2 className="text-xl font-semibold text-red-500">
									Access Denied
								</h2>
								<p className="text-neutral-400">
									You need administrator privileges to view
									this content
								</p>
							</div>
						</div>
					)}
				</div>

				{/* Implementation */}
				<div>
					<h3 className="text-lg font-medium mb-2">Implementation</h3>
					<CodeBlock
						code={protectedComponentCode}
						language="typescript"
						fileName="protected-component-example.tsx"
						showLineNumbers
						enableLineHighlight
						showMetaInfo
					/>
				</div>
			</div>

			{/* Utility Reference */}
			<div className="space-y-6">
				<h2 className="text-2xl font-semibold">Utility Reference</h2>

				<div>
					<h3 className="text-lg font-medium mb-2">
						getUser Utility
					</h3>
					<pre>src/shared/utilities/get-user.ts</pre>
					<CodeBlock
						code={getUserCode}
						language="typescript"
						fileName="get-user.ts"
						showLineNumbers
						enableLineHighlight
						showMetaInfo
					/>
				</div>

				<div>
					<h3 className="text-lg font-medium mb-2">
						Admin Protection Utilities
					</h3>
					<code>src/shared/components/admin-protection.tsx</code>
					<CodeBlock
						code={adminProtectionCode}
						language="typescript"
						fileName="admin-protection.ts"
						showLineNumbers
						enableLineHighlight
						showMetaInfo
					/>
				</div>
			</div>

			{/* Key Features Section remains the same ... */}
		</div>
	)
}
