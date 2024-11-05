import { getSession } from '@/features/auth/session'
import { redirect } from 'next/navigation'
import { handleSignOut } from './actions'

export default async function DashboardLayout({
	children
}: {
	children: React.ReactNode
}) {
	const session = await getSession()
	if (!session) redirect('/sign-in')

	return (
		<div className="min-h-screen bg-zinc-950">
			<nav className="border-b border-zinc-800 bg-black/50 backdrop-blur-sm">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex justify-between h-16 items-center">
						<div className="flex items-center gap-4">
							<span className="text-white">
								Welcome, {session.email}
							</span>
							<span
								className={`px-2 py-1 text-xs font-medium rounded-full ${
									session.role === 'admin'
										? 'bg-violet-500/10 text-violet-400 border border-violet-500/20'
										: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
								}`}
							>
								{session.role}
							</span>
						</div>
						<form action={handleSignOut}>
							<button
								type="submit"
								className="inline-flex items-center px-4 py-2 border border-transparent 
                                         text-sm font-medium rounded-md text-white bg-zinc-800 
                                         hover:bg-zinc-700 focus:outline-none focus:ring-2 
                                         focus:ring-offset-2 focus:ring-zinc-500 transition-colors"
							>
								Sign out
							</button>
						</form>
					</div>
				</div>
			</nav>

			<main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
				{children}
			</main>
		</div>
	)
}
