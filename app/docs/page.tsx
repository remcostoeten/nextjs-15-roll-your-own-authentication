import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'

export const metadata: Metadata = {
	title: 'Documentation | JWT Authentication',
	description: 'Documentation for JWT Authentication system',
}

export default function DocsPage() {
	return (
		<div className="space-y-8">
			<div className="space-y-4">
				<h1 className="scroll-m-20 text-4xl font-bold tracking-tight">
					Documentation
				</h1>
				<p className="text-xl text-muted-foreground">
					Welcome to the JWT Authentication documentation. Here you'll
					find comprehensive guides and documentation to help you
					start working with our authentication system as quickly as
					possible.
				</p>
			</div>

			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
				<Card>
					<CardHeader>
						<CardTitle>API Authentication</CardTitle>
						<CardDescription>
							Learn how to authenticate API requests using JWT
							tokens
						</CardDescription>
					</CardHeader>
					<CardContent>
						<Button
							asChild
							variant="outline"
							className="w-full"
						>
							<Link href="/docs/api-authentication">
								Read More
								<ArrowRight className="ml-2 h-4 w-4" />
							</Link>
						</Button>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>User Data</CardTitle>
						<CardDescription>
							Access user data on the server and client side
						</CardDescription>
					</CardHeader>
					<CardContent>
						<Button
							asChild
							variant="outline"
							className="w-full"
						>
							<Link href="/docs/user-data">
								Read More
								<ArrowRight className="ml-2 h-4 w-4" />
							</Link>
						</Button>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Storage Integration</CardTitle>
						<CardDescription>
							Integrate storage solutions with user authentication
						</CardDescription>
					</CardHeader>
					<CardContent>
						<Button
							asChild
							variant="outline"
							className="w-full"
						>
							<Link href="/docs/storage-integration">
								Read More
								<ArrowRight className="ml-2 h-4 w-4" />
							</Link>
						</Button>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Route Protection</CardTitle>
						<CardDescription>
							Protect routes and pages from unauthorized access
						</CardDescription>
					</CardHeader>
					<CardContent>
						<Button
							asChild
							variant="outline"
							className="w-full"
						>
							<Link href="/docs/route-protection">
								Read More
								<ArrowRight className="ml-2 h-4 w-4" />
							</Link>
						</Button>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Database Relations</CardTitle>
						<CardDescription>
							Learn how user data relates to other database tables
						</CardDescription>
					</CardHeader>
					<CardContent>
						<Button
							asChild
							variant="outline"
							className="w-full"
						>
							<Link href="/docs/database-relations">
								Read More
								<ArrowRight className="ml-2 h-4 w-4" />
							</Link>
						</Button>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Security Best Practices</CardTitle>
						<CardDescription>
							Follow best practices for securing your application
						</CardDescription>
					</CardHeader>
					<CardContent>
						<Button
							asChild
							variant="outline"
							className="w-full"
						>
							<Link href="/docs/security-best-practices">
								Read More
								<ArrowRight className="ml-2 h-4 w-4" />
							</Link>
						</Button>
					</CardContent>
				</Card>
			</div>
		</div>
	)
}
