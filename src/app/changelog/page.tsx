import type { Metadata } from 'next'
import { Header } from '../../components/layout/header'
import ChangelogView from '../../modules/changelog/changelog-view'

export const metadata: Metadata = {
	title: 'Changelog | Roll Your Own Auth',
	description:
		'Latest updates and improvements to our authentication framework.',
}

export default function ChangelogPage() {
	return (
		<div className="min-h-screen bg-[#0D0C0C]">
			<Header />
			<ChangelogView />
		</div>
	)
}
