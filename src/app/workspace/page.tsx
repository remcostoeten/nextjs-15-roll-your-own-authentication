import { db } from '@/db'
import { workspaces } from '@/db/schema'
import WorkspaceCreationForm from '@/features/workspaces/components/workspace-creation-form'
import { getUser } from '@/shared/utilities/get-user'
import { eq } from 'drizzle-orm'
import { redirect } from 'next/navigation'

export default async function WorkspacePage() {
	const user = await getUser()
	if (!user) {
		redirect('/sign-in')
	}

	// Check if user has any workspaces
	const userWorkspaces = await db
		.select()
		.from(workspaces)
		.where(eq(workspaces.userId, user.userId))

	// If user has no workspaces, show creation form
	if (userWorkspaces.length === 0) {
		return <WorkspaceCreationForm />
	}

	// If user has workspaces, redirect to their first workspace
	redirect(`/workspace/${userWorkspaces[0].slug}`)
}
