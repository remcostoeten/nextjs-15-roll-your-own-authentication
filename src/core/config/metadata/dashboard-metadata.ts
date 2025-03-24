import { Metadata } from 'next'

export const dashboardMetadata: Metadata = {
	title: 'Dashboard | Your App Name',
	description: 'View your account details, activity, and metrics.',
	openGraph: {
		title: 'Dashboard | Your App Name',
		description: 'View your account details, activity, and metrics.',
		type: 'website',
	},
	robots: {
		index: false,
		follow: false,
	},
}
