export function LoadingSpinner() {
	return (
		<div
			className="flex items-center justify-center"
			aria-label="Loading..."
		>
			<div className="animate-spin h-6 w-6 border-2 border-current border-t-transparent text-zinc-200 rounded-full">
				<span className="sr-only">Loading...</span>
			</div>
		</div>
	)
}
