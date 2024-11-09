import { getSession } from '@/features/auth/actions/get-session.action'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
	const session = await getSession()
	const allCookies = cookies().getAll()

	if (!session) {
		redirect('/sign-in')
	}

	return (
		<div className="p-8 space-y-6">
			<div>
				<h1 className="text-2xl font-bold mb-4 text-[#1a1a1a] hover:text-black dark:text-zinc-200 dark:hover:text-white">
					Dashboard
				</h1>
				<p className="text-[#1a1a1a] hover:text-black dark:text-zinc-200 dark:hover:text-white">
					Welcome, {session.email}
				</p>
			</div>

			<div className="space-y-4">
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

					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div className="p-4 border border-[#1a1a1a]/10 dark:border-zinc-800 rounded-lg bg-[#1a1a1a]/5 dark:bg-zinc-900">
							<h3 className="font-medium mb-2 text-[#1a1a1a] hover:text-black dark:text-zinc-200 dark:hover:text-white">
								User Status
							</h3>
							<ul className="space-y-2 text-[#1a1a1a] dark:text-zinc-300">
								<li>
									<span className="font-medium">Role:</span>{' '}
									{session.role}
								</li>
								<li>
									<span className="font-medium">
										User ID:
									</span>{' '}
									{session.userId}
								</li>
								<li>
									<span className="font-medium">Email:</span>{' '}
									{session.email}
								</li>
							</ul>
						</div>

						<div className="p-4 border border-[#1a1a1a]/10 dark:border-zinc-800 rounded-lg bg-[#1a1a1a]/5 dark:bg-zinc-900">
							<h3 className="font-medium mb-2 text-[#1a1a1a] hover:text-black dark:text-zinc-200 dark:hover:text-white">
								Session Info
							</h3>
							<ul className="space-y-2 text-[#1a1a1a] dark:text-zinc-300">
								<li>
									<span className="font-medium">
										Auth Status:
									</span>{' '}
									{session
										? 'Authenticated'
										: 'Not Authenticated'}
								</li>
								<li>
									<span className="font-medium">
										Is Admin:
									</span>{' '}
									{session.role === 'admin' ? 'Yes' : 'No'}
								</li>
							</ul>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
