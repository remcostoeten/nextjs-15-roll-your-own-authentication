import { cn } from '@/lib/utils'
import { ComponentProps } from 'react'

interface ChangelogSkeletonProps extends ComponentProps<'div'> {
	days?: number
	commitsPerDay?: number
}

export function ChangelogSkeleton({
	className,
	days = 2,
	commitsPerDay = 3,
	...props
}: ChangelogSkeletonProps) {
	return (
		<div className={cn('space-y-8 ', className)} {...props}>
			{/* Header */}
			<div className="flex items-center justify-between">
				<div className="h-8 w-32 bg-skeleton rounded-lg animate-pulse backdrop-blur-sm border border-[#222]/20" />
				<div className="h-10 w-64 bg-skeleton rounded-lg animate-pulse backdrop-blur-sm border border-[#222]/20" />
			</div>

			{/* Navigation Tabs */}
			<div className="flex items-center gap-4 h-10 w-24 overflow-hidden rounded-xl">
				<div className="h-10 w-24 bg-skeleton-lightrounded-lg animate-pulse bg-skeleton-ligh backdrop-blur-sm border border-[#222]/20" />
				<div className="h-10 w-24 bg-skeleton rounded-lg animate-shimmer backdrop-blur-sm border border-[#222]/20" />
			</div>

			{/* Timeline */}
			<div className="space-y-8">
				{Array.from({ length: days }).map((_, dayIndex) => (
					<div key={dayIndex} className="space-y-4">
						{/* Date Separator */}
						<div className="flex items-center gap-4">
							<div className="h-px flex-1 bg-[#111]/50" />
							<div className="h-5 w-40 bg-skeleton rounded animate-pulse backdrop-blur-sm border border-[#222]/20" />
							<div className="h-px flex-1 bg-[#111]/50" />
						</div>

						<div className="space-y-4">
							{Array.from({ length: commitsPerDay }).map(
								(_, commitIndex) => (
									<div
										key={commitIndex}
										className="relative pl-6 border-l border-[#222]/50 last:border-l-transparent"
									>
										{/* Timeline dot */}
										<div className="absolute left-0 top-0 -translate-x-1/2 w-3 h-3 rounded-full bg-skeleton border-2 border-[#222]/40" />

										<div className="bg-gradient-to-r-from-bg-white-10 to-bg-black border border-[#151515] backdrop-blur-sm rounded-lg border-[#222]/50 p-4 overflow-hidden relative group">
											{/* Shimmer effect */}
											<div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-[#fff]/[4%] to-transparent" />

											<div className="space-y-4 relative">
												{/* Commit Header */}
												<div className="flex items-center gap-2">
													<div className="w-5 h-5 rounded-full bg-skeleton-light animate-pulse backdrop-blur-sm border border-[#222]/20" />
													<div className="h-5 w-2/3 bg-skeleton-light rounded animate-pulse backdrop-blur-sm border border-[#222]/20" />
												</div>

												{/* Quick Info */}
												<div className="flex items-center gap-6">
													{/* Branch */}
													<div className="flex items-center gap-2">
														<div className="w-4 h-4 rounded bg-skeleton-light animate-pulse backdrop-blur-sm border border-[#222]/20" />
														<div className="h-4 w-24 bg-skeleton-light rounded animate-pulse backdrop-blur-sm border border-[#222]/20" />
													</div>

													<div className="flex items-center gap-2">
														<div className="w-4 h-4 rounded bg-skeleton-light animate-pulse backdrop-blur-sm border border-[#222]/20" />
														<div className="h-4 w-16 bg-skeleton-light rounded animate-pulse backdrop-blur-sm border border-[#222]/20" />
													</div>

													{/* Files */}
													<div className="flex items-center gap-2">
														<div className="w-4 h-4 rounded bg-skeleton-light animate-pulse backdrop-blur-sm border border-[#222]/20" />
														<div className="h-4 w-20 bg-skeleton-light rounded animate-pulse backdrop-blur-sm border border-[#222]/20" />
													</div>
												</div>

												{/* Author Info */}
												<div className="flex justify-end items-center gap-4">
													<div className="space-y-1 text-right">
														<div className="h-4 w-24 bg-skeleton-light rounded animate-pulse backdrop-blur-sm border border-[#222]/20 ml-auto" />
														<div className="h-3 w-16 bg-skeleton-light rounded animate-pulse backdrop-blur-sm border border-[#222]/20 ml-auto" />
													</div>
													<div className="w-5 h-5 rounded-full bg-skeleton-light animate-pulse backdrop-blur-sm border border-[#222]/20" />
												</div>
											</div>
										</div>
									</div>
								)
							)}
						</div>
					</div>
				))}
			</div>
		</div>
	)
}
