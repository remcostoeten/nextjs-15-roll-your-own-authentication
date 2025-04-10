import type { Metadata } from 'next'
import RouteProtectionClientPage from './RouteProtectionClientPage'

export const metadata: Metadata = {
	title: 'Route Protection | Documentation',
	description: 'Protect routes and pages from unauthorized access',
}

export default function RouteProtectionPage() {
	return <RouteProtectionClientPage />
}
