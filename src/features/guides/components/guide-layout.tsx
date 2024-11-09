import { cn } from '@/lib/utils'
import { CalendarDays } from 'lucide-react'
import type { GuideMetadata } from '../types/guide'
import GuideSidebar from './guide-sidebar'

type GuideLayoutProps = {
	metadata: GuideMetadata
	children: React.ReactNode
	className?: string
}

export default function GuideLayout({
	metadata,
	children,
	className
}: GuideLayoutProps) {
	return (
		<div className="max-w-7xl mx-auto p-6">
			<div className="flex gap-12">
				<div className="w-64 hidden lg:block">
					<GuideSidebar sections={metadata.sections} />
				</div>

				<div className={cn('flex-1 max-w-4xl space-y-8', className)}>
					<div className="space-y-4">
						<div className="space-y-2">
							<h1 className="text-3xl font-bold">
								{metadata.title}
							</h1>
							<p className="text-lg text-neutral-400">
								{metadata.description}
							</p>
						</div>

						{metadata.lastUpdated && (
							<div className="flex items-center gap-2 text-sm text-neutral-500">
								<CalendarDays className="h-4 w-4" />
								Last updated:{' '}
								{new Date(
									metadata.lastUpdated
								).toLocaleDateString()}
							</div>
						)}
					</div>

					{children}
				</div>
			</div>
		</div>
	)
}
