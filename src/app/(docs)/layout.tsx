// Add a docs layout for consistent styling
export default function DocsLayout({
	children
}: {
	children: React.ReactNode
}) {
	return (
		<div className="max-w-4xl mx-auto p-6">
			<div className="prose prose-invert">{children}</div>
		</div>
	)
}
