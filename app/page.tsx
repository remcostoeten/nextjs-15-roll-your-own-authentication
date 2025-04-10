import Title from '@/shared/components/headings'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { getCurrentUser } from '@/modules/authentication/utilities/auth'
import { redirect } from 'next/navigation'
import { Center } from '@/shared/components/center'

export default async function Home() {
	const user = await getCurrentUser()

	if (user) {
		redirect('/dashboard')
	}

	return (
		<Center>
			<div className="max-w-md text-center">
				<Title
					level={1}
					className="mb-4 text-4xl font-bold"
				>
					JWT Authentication
				</Title>

				<p className="mb-8 text-muted-foreground">
					A secure authentication system using JWT tokens and
					PostgreSQL
				</p>

				<div className="flex justify-center gap-4">
					<Button asChild>
						<Link href="/register">Register</Link>
					</Button>
					<Button
						asChild
						variant="outline"
					>
						<Link href="/login">Login</Link>
					</Button>
				</div>
			</div>
		</Center>
	)
}
