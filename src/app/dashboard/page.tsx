import { getSession } from '@/features/auth/session'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
	const session = await getSession()
	const cookieStore = await cookies()
	const allCookies = cookieStore.getAll()

	if (!session) {
		redirect('/sign-in')
	}

	const metrics = [
		{
			id: 'user-status',
			title: 'User Status',
			value: session.role,
			description: `User ID: ${session.userId}`
		},
		{
			id: 'auth-status',
			title: 'Auth Status',
			value: 'Authenticated',
			description: `Role: ${session.role === 'admin' ? 'Administrator' : 'User'}`
		},
		{
			id: 'session-info',
			title: 'Session Info',
			value: session.email,
			description: 'Current active session'
		}
	]

	return (
		<div className="space-y-6">
			<div className="p-8">
				<h1 className="text-2xl font-bold mb-4 text-[#1a1a1a] hover:text-black dark:text-zinc-200 dark:hover:text-white">
					Dashboard
				</h1>
				<p className="text-[#1a1a1a] hover:text-black dark:text-zinc-200 dark:hover:text-white">
					Welcome, {session.email}
				</p>
			</div>

			<div className="p-8 space-y-4">
				<h2 className="text-xl font-semibold text-[#1a1a1a] hover:text-black dark:text-zinc-200 dark:hover:text-white">
					Debug Information
				</h2>

				<div className="space-y-4">
					<div>
						<h3 className="text-lg font-medium mb-2 text-[#1a1a1a] hover:text-black dark:text-zinc-200 dark:hover:text-white">
							Session Data
						</h3>
						<pre className="bg-[#1a1a1a]/5 dark:bg-zinc-900 p-4 rounded-lg overflow-auto border border-[#1a1a1a]/10 dark:border-zinc-800">
							<code className="text-sm text-[#1a1a1a] dark:text-zinc-200">
								{JSON.stringify(session, null, 2)}
							</code>
						</pre>
					</div>

					<div>
						<h3 className="text-lg font-medium mb-2 text-[#1a1a1a] hover:text-black dark:text-zinc-200 dark:hover:text-white">
							Cookies
						</h3>
						<pre className="bg-[#1a1a1a]/5 dark:bg-zinc-900 p-4 rounded-lg overflow-auto border border-[#1a1a1a]/10 dark:border-zinc-800">
							<code className="text-sm text-[#1a1a1a] dark:text-zinc-200">
								{JSON.stringify(allCookies, null, 2)}
							</code>
						</pre>
					</div>
				</div>
			</div>
		</div>
	)
}
