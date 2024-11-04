import { authMetadata } from '@/core/config/metadata'

export const metadata = authMetadata

export default function AuthLayout({ children }: PageProps) {
	return (
		<div className="min-h-screen bg-gradient-to-b from-black to-zinc-900 flex items-center justify-center p-4">
			<div className="w-full max-w-md mx-auto">
				<div className="bg-black/40 backdrop-blur-sm rounded-xl border border-zinc-800/50 shadow-2xl">
					{children}
				</div>
			</div>
		</div>
	)
}
