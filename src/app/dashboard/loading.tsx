export default function Loading() {
	return (
		<div className="max-w-3xl mx-auto mt-10">
			<div className="flex items-center justify-between">
				<div className="h-8 w-48 bg-gray-200 animate-pulse rounded" />
				<div className="h-10 w-24 bg-gray-200 animate-pulse rounded" />
			</div>
			<div className="mt-4 p-4 bg-white rounded-lg shadow">
				<div className="h-6 w-32 bg-gray-200 animate-pulse rounded" />
				<div className="mt-2 space-y-2">
					<div className="h-5 w-64 bg-gray-200 animate-pulse rounded" />
					<div className="h-5 w-48 bg-gray-200 animate-pulse rounded" />
				</div>
			</div>
		</div>
	);
}
