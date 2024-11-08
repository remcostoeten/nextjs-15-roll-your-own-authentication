import { getAdminStats, getSystemHealth } from '@/features/admin/components/actions/admin'

export default async function AdminPage() {
	const stats = await getAdminStats()
	const health = await getSystemHealth()

	return (
		<div>
			{/* Your admin page content */}
		</div>
	)
}
