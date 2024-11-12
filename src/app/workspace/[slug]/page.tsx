import { db } from '@/db'
import { workspaces } from '@/db/schema'
import { getUser } from '@/shared/utilities/get-user'
import { eq } from 'drizzle-orm'
import { notFound, redirect } from 'next/navigation'

export default async function WorkspacePage({
	params
}: {
	params: { slug: string }
}) {
	const user = await getUser()
	if (!user) {
		redirect('/sign-in')
	}

	const [workspace] = await db
		.select()
		.from(workspaces)
		.where(eq(workspaces.slug, params.slug))
		.limit(1)

	if (!workspace || workspace.userId !== user.userId) {
		notFound()
	}

	return (
		<div className="container mx-auto p-6">
			<div className="flex items-center gap-2 mb-6">
				<span className="text-2xl">{workspace.emoji}</span>
				<h1 className="text-2xl font-bold">{workspace.name}</h1>
			</div>
			{workspace.description && (
				<p className="text-muted-foreground">{workspace.description}</p>
			)}
			{/* Add your workspace content here */}
		</div>
	)
}
