import { Metadata } from 'next'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export const metadata: Metadata = {
	title: 'Overview of Features | Auth System Docs'
}

export default function OverviewPage() {
	return (
		<article className="max-w-3xl mx-auto">
			<h1 className="text-3xl font-bold mb-6">Overview of Features</h1>

			<Tabs defaultValue="auth" className="mb-6">
				<TabsList>
					<TabsTrigger value="auth">Authentication</TabsTrigger>
					<TabsTrigger value="user">User Management</TabsTrigger>
					<TabsTrigger value="security">Security</TabsTrigger>
				</TabsList>
				<TabsContent value="auth">
					<Card>
						<CardHeader>
							<CardTitle>Authentication Features</CardTitle>
							<CardDescription>
								Core authentication functionality
							</CardDescription>
						</CardHeader>
						<CardContent>
							<ul className="list-disc pl-5">
								<li>
									User registration with email and password
								</li>
								<li>User login with session management</li>
								<li>Password hashing with bcrypt</li>
								<li>Role-based access control (User/Admin)</li>
							</ul>
						</CardContent>
					</Card>
				</TabsContent>
				<TabsContent value="user">
					<Card>
						<CardHeader>
							<CardTitle>User Management Features</CardTitle>
							<CardDescription>
								Manage user accounts and profiles
							</CardDescription>
						</CardHeader>
						<CardContent>
							<ul className="list-disc pl-5">
								<li>User profile management</li>
								<li>Admin dashboard for user overview</li>
								<li>User role management</li>
							</ul>
						</CardContent>
					</Card>
				</TabsContent>
				<TabsContent value="security">
					<Card>
						<CardHeader>
							<CardTitle>Security Features</CardTitle>
							<CardDescription>
								Keeping your application secure
							</CardDescription>
						</CardHeader>
						<CardContent>
							<ul className="list-disc pl-5">
								<li>CSRF protection</li>
								<li>Secure session management</li>
								<li>
									Environment variable management for
									sensitive data
								</li>
								<li>Input validation and sanitization</li>
							</ul>
						</CardContent>
					</Card>
				</TabsContent>
			</Tabs>

			<h2 className="text-2xl font-semibold mb-4">Authentication Flow</h2>
			<div className="mb-6">
				<pre>
					<code>
						{`mermaid
            sequenceDiagram
              participant User
              participant Client
              participant Server
              participant Database

              User->>Client: Enter credentials
              Client->>Server: Send login request
              Server->>Database: Verify credentials
              Database-->>Server: Credentials valid
              Server->>Server: Create session
              Server-->>Client: Send session token
              Client->>Client: Store session token
              Client-->>User: Login successful
            `}
					</code>
				</pre>
			</div>

			<h2 className="text-2xl font-semibold mb-4">
				Additional Resources
			</h2>
			<div className="mb-6">
				<p>For more information, check out the following resources:</p>
				<ul className="list-disc pl-5">
					<li>
						<Link href="/docs/authentication">
							Authentication Documentation
						</Link>
					</li>
					<li>
						<Link href="/docs/user-management">
							User Management Documentation
						</Link>
					</li>
					<li>
						<Link href="/docs/security">
							Security Documentation
						</Link>
					</li>
				</ul>
			</div>

			<Button asChild>
				<Link href="/docs">Back to Documentation</Link>
			</Button>
		</article>
	)
}
