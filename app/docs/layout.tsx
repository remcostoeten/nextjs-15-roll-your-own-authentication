import { DocsHeader } from '@/features/docs/components/docs-header'
import { DocsSidebar } from '@/features/docs/components/docs-sidebar'

export default function DocsLayout({
	children
}: {
	children: React.ReactNode
}) {
	return (
		<div className="flex flex-col min-h-screen">
			<DocsHeader />
			<div className="flex-1 flex">
				<DocsSidebar />
				<main className="flex-1 p-6 overflow-y-auto">{children}</main>
			</div>
		</div>
	)
}
