import { getSession } from '@/features/auth/actions/get-session.action'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
	const session = await getSession()

	if (!session) {
		redirect('/sign-in')
	}

	return (
		<div className="p-8">
			<h1 className="text-2xl font-bold mb-4">Dashboard</h1>
			<p className="text-zinc-200">Welcome, {session.email}</p>
		</div>
	)
}
