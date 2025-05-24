export default function DashboardLoading() {
	return (
		<div className="h-screen w-full flex items-center justify-center bg-linear-to-br from-gray-900 to-black">
			<div className="space-y-8 w-full max-w-md px-4">
				{/* Profile section skeleton */}
				<div className="bg-gray-800/50 rounded-lg p-6 backdrop-blur-xs">
					<div className="flex items-center space-x-4">
						<div className="h-16 w-16 rounded-full bg-gray-700/50 animate-pulse" />
						<div className="space-y-2 flex-1">
							<div className="h-4 w-1/2 bg-gray-700/50 rounded animate-pulse" />
							<div className="h-3 w-3/4 bg-gray-700/50 rounded animate-pulse" />
						</div>
					</div>
				</div>

				{/* Stats section skeleton */}
				<div className="grid grid-cols-2 gap-4">
					{[...Array(4)].map((_, i) => (
						<div key={i} className="bg-gray-800/50 rounded-lg p-4 backdrop-blur-xs">
							<div className="h-3 w-1/2 bg-gray-700/50 rounded animate-pulse mb-2" />
							<div className="h-6 w-1/3 bg-gray-700/50 rounded animate-pulse" />
						</div>
					))}
				</div>

				{/* Recent activity skeleton */}
				<div className="bg-gray-800/50 rounded-lg p-6 backdrop-blur-xs">
					<div className="h-4 w-1/3 bg-gray-700/50 rounded animate-pulse mb-4" />
					<div className="space-y-3">
						{[...Array(3)].map((_, i) => (
							<div key={i} className="flex items-center space-x-3">
								<div className="h-8 w-8 rounded-full bg-gray-700/50 animate-pulse" />
								<div className="flex-1">
									<div className="h-3 w-3/4 bg-gray-700/50 rounded animate-pulse mb-2" />
									<div className="h-2 w-1/2 bg-gray-700/50 rounded animate-pulse" />
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}
