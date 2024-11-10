import Changelog from '@/features/changelog/components/changelog'
import { Metadata } from 'next'

export const metadata: Metadata = {
	title: 'Changelog',
	description: 'Stay up to date with our latest features and improvements',
	openGraph: {
		title: 'Changelog',
		description: 'Stay up to date with our latest features and improvements',
		type: 'website',
		url: '/changelog',
	}
}

export default function ChangelogPage() {
	return (
		<Changelog />
	)
}
