import Changelog from '@/features/changelog/components/changelog'
import { Metadata } from 'next'

export const metadata: Metadata = {
	title: 'Changelog',
	description: 'Stay up to date with our latest features and improvements',
	openGraph: {
		title: 'Changelog',
		description:
			'Stay up to date with our latest features and improvements',
		type: 'website'
	}
}

export default function ChangelogPage() {
	return (
		<div className="container mx-auto py-8">
			<Changelog />
		</div>
	)
}
