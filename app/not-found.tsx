import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Icons } from '@/components/icons'
import { AlertCircle, Home, LayoutDashboard } from 'lucide-react'
import { Center } from '@/shared/components/center'

export default function NotFound() {
	return (
		<Center className="flex flex-col gap-4">
			<div className="flex flex-col items-center gap-2">
				<AlertCircle className="h-16 w-16 text-muted-foreground" />
				<h1 className="text-4xl font-bold tracking-tight">
					Page not found
				</h1>
				<p className="text-lg text-muted-foreground">
					The page you're looking for doesn't exist or has been moved.
				</p>
			</div>
			<div className="flex gap-4">
				<Button
					asChild
					variant="default"
				>
					<Link href="/">
						<Home className="mr-2 h-4 w-4" />
						Return home
					</Link>
				</Button>
				<Button
					asChild
					variant="outline"
				>
					<Link href="/dashboard">
						<LayoutDashboard className="mr-2 h-4 w-4" />
						Go to dashboard
					</Link>
				</Button>
			</div>
		</Center>
	)
}
