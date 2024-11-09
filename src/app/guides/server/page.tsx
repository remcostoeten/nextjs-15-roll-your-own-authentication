import AuthDemoSkeleton from '@/features/auth/components/auth-demo-skeleton'
import CodeBlock from '@/shared/_docs/code-block/code-block'
import { isAdmin } from '@/shared/utilities/get-admin'
import { getUser } from '@/shared/utilities/get-user'
import { RefreshCw, Shield } from 'lucide-react'
import { Suspense } from 'react'
import { Button } from 'ui'

async function DemoAuthComponent() {
	const user = await getUser()

	return (
		<div className="border border-neutral-800 rounded-lg p-6 space-y-4">
			<div className="flex items-center justify-between">
				<h3 className="text-lg font-semibold">
					Live Demo: Server Auth
				</h3>
				<form
					action={async () => {
						'use server'
						// This empty action will trigger a revalidation
					}}
				>
					<Button variant="outline" size="sm" className="gap-2">
						<RefreshCw className="h-4 w-4" />
						Rerun Check
					</Button>
				</form>
			</div>

			{user ? (
				<div className="space-y-2">
					<p>
						<span className="font-medium">Email:</span> {user.email}
					</p>
					<p>
						<span className="font-medium">Role:</span> {user.role}
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
	)
}

// Code examples
const basicAuthCode = `
// In any Server Component
import { getUser } from '@/shared/utilities/get-user'

export default async function Page() {
  const user = await getUser()
  
  if (!user) {
    return <div>Please sign in</div>
  }
  
  return (
    <div>
      <h1>Welcome {user.email}</h1>
      <p>Role: {user.role}</p>
    </div>
  )
}`

const adminCheckCode = `
// Method 1: Direct admin check
import { isAdmin } from '@/shared/utilities/get-admin'

export default async function AdminPage() {
  const adminStatus = await isAdmin()
  
  if (!adminStatus) {
    return <div>Access Denied</div>
  }
  
  return <AdminDashboard />
}

// Method 2: Using protection wrapper
export default async function Page() {
  return await withAdminProtection(
    AdminComponent,
    { props: 'here' },
    <div>Access Denied</div> // Optional fallback
  )
}`

const redirectCode = `
import { redirect } from 'next/navigation'
import { getUser, isAdmin } from '@/shared/utilities'

export default async function ProtectedPage() {
  const user = await getUser()
  
  if (!user) {
    redirect('/sign-in')
  }
  
  // Optional: Also check admin status
  const adminStatus = await isAdmin()
  if (!adminStatus) {
    redirect('/dashboard')
  }
  
  return <ProtectedContent user={user} />
}`

export default async function ServerAuthTutorial() {
	let adminStatus = false

	try {
		adminStatus = await isAdmin()
	} catch (error) {
		console.error('Error checking admin status:', error)
	}

	return (
		<div className="max-w-4xl mx-auto p-6 space-y-8">
			{/* Header */}
			<div className="space-y-2">
				<h1 className="text-3xl font-bold">
					Server-Side Authentication Guide
				</h1>
				<p className="text-lg text-neutral-400">
					Learn how to implement authentication in server components
					and server-side rendering.
				</p>
			</div>

			{/* Basic Auth Section */}
			<section className="space-y-6">
				<h2 className="text-2xl font-semibold">Basic Authentication</h2>
				<p className="text-neutral-400">
					Get started with basic authentication checks in server
					components:
				</p>

				{/* Live Demo with Suspense */}
				<Suspense fallback={<AuthDemoSkeleton />}>
					<DemoAuthComponent />
				</Suspense>

				{/* Implementation */}
				<div>
					<h3 className="text-lg font-medium mb-2">Implementation</h3>
					<CodeBlock
						code={basicAuthCode}
						language="typescript"
						fileName="page.tsx"
						showLineNumbers
						enableLineHighlight
						showMetaInfo
					/>
				</div>
			</section>

			{/* Admin Protection Section */}
			<section className="space-y-6">
				<h2 className="text-2xl font-semibold">Admin Protection</h2>
				<p className="text-neutral-400">
					Protect routes and components for admin-only access:
				</p>

				<div
					className={`p-4 rounded-lg border ${
						adminStatus
							? 'bg-purple-500/10 border-purple-500/20'
							: 'bg-red-500/10 border-red-500/20'
					}`}
				>
					<div className="flex items-center gap-2">
						<Shield className="h-4 w-4" />
						<h3 className="font-medium">Admin Status Check</h3>
					</div>
					<p className="mt-1 text-neutral-400">
						You are{' '}
						{adminStatus
							? 'an administrator'
							: 'not an administrator'}
					</p>
				</div>

				<div>
					<h3 className="text-lg font-medium mb-2">Implementation</h3>
					<CodeBlock
						code={adminCheckCode}
						language="typescript"
						fileName="admin-page.tsx"
						showLineNumbers
						enableLineHighlight
						showMetaInfo
					/>
				</div>
			</section>

			{/* Redirects Section */}
			<section className="space-y-6">
				<h2 className="text-2xl font-semibold">
					Authentication Redirects
				</h2>
				<p className="text-neutral-400">
					Handle unauthorized access with proper redirects:
				</p>

				<div>
					<h3 className="text-lg font-medium mb-2">Implementation</h3>
					<CodeBlock
						code={redirectCode}
						language="typescript"
						fileName="protected-page.tsx"
						showLineNumbers
						enableLineHighlight
						showMetaInfo
					/>
				</div>
			</section>

			{/* Best Practices */}
			<section className="space-y-4">
				<h2 className="text-2xl font-semibold">Best Practices</h2>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div className="p-4 border border-neutral-800 rounded-lg">
						<h3 className="font-medium mb-2">Error Handling</h3>
						<ul className="list-disc list-inside space-y-1 text-neutral-400">
							<li>Always use try-catch blocks</li>
							<li>Provide meaningful error messages</li>
							<li>Handle edge cases gracefully</li>
						</ul>
					</div>
					<div className="p-4 border border-neutral-800 rounded-lg">
						<h3 className="font-medium mb-2">Performance</h3>
						<ul className="list-disc list-inside space-y-1 text-neutral-400">
							<li>Cache authentication results</li>
							<li>Use proper loading states</li>
							<li>Implement proper redirects</li>
						</ul>
					</div>
				</div>
			</section>
		</div>
	)
}
