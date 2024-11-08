import { Button } from '@/components/ui/button'
import { FileQuestion, Home } from 'lucide-react'
import Link from 'next/link'

export default function NotFound() {
	return (
		<div className="min-h-screen flex items-center justify-center p-4">
			<div className="max-w-md w-full space-y-8 text-center">
				{/* 404 Gradient Text */}
				<h1 className="text-[150px] font-bold leading-none bg-clip-text text-transparent bg-gradient-to-r from-vercel-blue to-vercel-cyan">
					404
				</h1>

				{/* Icon */}
				<div className="relative">
					<div className="absolute inset-0 bg-vercel-blue/20 blur-xl rounded-full" />
					<div className="relative bg-black/40 backdrop-blur-sm border border-white/10 w-20 h-20 rounded-2xl mx-auto flex items-center justify-center">
						<FileQuestion className="w-10 h-10 text-vercel-blue" />
					</div>
				</div>

				{/* Text Content */}
				<div className="space-y-2">
					<h2 className="text-2xl font-semibold text-white">
						Page Not Found
					</h2>
					<p className="text-gray-400">
						The page you're looking for doesn't exist or has been
						moved.
					</p>
				</div>

				{/* Action Buttons */}
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
						className="bg-vercel-blue hover:bg-vercel-blue/90"
						asChild
					>
						<Link href="/changelog">View Changelog</Link>
					</Button>
				</div>
			</div>
		</div>
	)
}
