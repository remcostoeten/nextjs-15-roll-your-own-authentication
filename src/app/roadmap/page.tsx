import type { Metadata } from 'next'
import { Header } from '../../modules/(homepage)/header/header'
import RoadmapView from '../../modules/roadmap/roadmap-view'
import { Footer } from '../../modules/(homepage)/components/footer'

export const metadata: Metadata = {
	title: 'Roadmap | Roll Your Own Auth',
	description: 'Track the development of Roll Your Own Auth features and improvements.',
}

export default function RoadmapPage() {
	return (
		<div className="min-h-screen bg-[#0D0C0C]">
			<Header />
			<main className="pt-16">
				<RoadmapView />
			</main>
			<Footer />
		</div>
	)
}
