
export default function Loading() {
	return (
		<>
			{/* Grid of skeleton cards */}
			<div className="grid auto-rows-min gap-4 	md:grid-cols-3">
				{Array.from({ length: 3 }).map((_, i) => (
					<div key={i} className="aspect-video rounded-xl bg-muted/50 animate-pulse">
						<div className="h-full w-full p-4">
							<div className="h-4 w-2/3 bg-muted animate-pulse rounded-md mb-2" />
							<div className="h-3 w-1/2 bg-muted animate-pulse rounded-md" />
						</div>
					</div>
				))}
			</div>
			{/* Main content skeleton */}
			<div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min animate-pulse p-6">
				<div className="space-y-4 max-w-2xl">
					<div className="h-6 w-48 bg-muted animate-pulse rounded-md" />
					<div className="space-y-2">
						{[1, 2, 3, 4].map((i) => (
							<div key={i} className="h-4 w-full bg-muted animate-pulse rounded-md" />
						))}
					</div>
				</div>
			</div>
		</>
	);
}
