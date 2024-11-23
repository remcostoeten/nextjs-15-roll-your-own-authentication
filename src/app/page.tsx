import Link from 'next/link'
import {
	Button,
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle
} from 'ui'

export default function HomePage() {
	return (
		<div className="container mx-auto px-4 py-8">
			<Card className="max-w-2xl mx-auto">
				<CardHeader>
					<CardTitle className="text-3xl font-bold text-center">
						Welcome to Auth Dashboard
					</CardTitle>
					<CardDescription className="text-center text-lg mt-2">
						Your secure authentication and user management solution
					</CardDescription>
				</CardHeader>
				<CardContent className="text-center">
					<p className="mb-4">
						Auth Dashboard provides a robust authentication system
						with features like:
					</p>
					<ul className="list-disc list-inside text-left max-w-md mx-auto mb-6">
						<li>Secure user registration and login</li>
						<li>Email verification</li>
						<li>Password strength validation</li>
						<li>Role-based access control</li>
						<li>User analytics and login history</li>
					</ul>
					<p>
						Get started by creating an account or logging in if you
						already have one.
					</p>
				</CardContent>
				<CardFooter className="flex justify-center space-x-4">
					<Button asChild>
						<Link href="/register">Register</Link>
					</Button>
					<Button asChild variant="outline">
						<Link href="/login">Login</Link>
					</Button>
				</CardFooter>
			</Card>
		</div>
	)
}
