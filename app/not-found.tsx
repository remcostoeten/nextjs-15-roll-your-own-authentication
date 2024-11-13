import { FileQuestion, Home } from 'lucide-react'
import Link from 'next/link'
import { Button } from '../components/ui/button'

export default function NotFound() {
	return (
		<div className="min-h-screen flex items-center justify-center p-4">
			<div className="max-w-md w-full space-y-8 text-center">
				{/* 404 Gradient Text */}
				<h1 className="text-[150px] font-bol dtext-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-neutral-400">
					404
				</h1>

				{/* Icon */}
				<div className="relative">
					<div className="absolute inset-0 bg-vercel-orange/20 blur-xl rounded-full" />
					<div className="relative bg-black/40 backdrop-blur-sm border border-white/10 w-20 h-20 rounded-2xl mx-auto flex items-center justify-center">
						<FileQuestion className="w-10 h-10 text-orange-400" />
					</div>
				</div>

				{/* Text Content */}
				<div className="space-y-2">
					<h2 className="text-2xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-neutral-400">
						Page Not Found
					</h2>
					<p className="text-gray-400">
						The page you&apos;re looking for doesn&apos;t exist or
						has been moved.
					</p>
				</div>

				<div className="flex items-center justify-center gap-4 pt-4">
					<Button
						variant="outline"
						className="bg-black/40 backdrop-blur-sm border-white/10"
						asChild
					>
						<Link href="/">
							<Home className="w-4 h-4 mr-2" />
							Go Home
						</Link>
					</Button>
					<Button
						className="bg-vercel-orange hover:bg-vercel-orange/90"
						asChild
					>
						<Link href="/changelog">View Changelog</Link>
					</Button>
				</div>
			</div>
		</div>
	)
}
