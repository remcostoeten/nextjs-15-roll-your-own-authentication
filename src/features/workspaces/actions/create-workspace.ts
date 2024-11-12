'use server'

import { db } from '@/db'
import { getUser } from '@/shared/utilities/get-user'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { workspaces } from '../db/schema'
import { workspaceSchema } from '../validations/models/workspace.z'

export async function createWorkspace(prevState: any, formData: FormData) {
	const user = await getUser()
	if (!user) {
		return { error: { _form: ['Not authenticated'] } }
	}

	const validatedFields = workspaceSchema.safeParse({
		name: formData.get('name'),
		description: formData.get('description'),
		emoji: formData.get('emoji')
	})

	if (!validatedFields.success) {
		return {
			error: validatedFields.error.flatten().fieldErrors
		}
	}

	const { name, description, emoji } = validatedFields.data
	const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-')

	try {
		const [workspace] = await db
			.insert(workspaces)
			.values({
				name,
				description,
				emoji,
				slug,
				userId: user.userId
			})
			.returning()

		revalidatePath('/workspace')
		redirect(`/workspace/${workspace.slug}`)
	} catch (error) {
		console.error('Workspace creation error:', error)
		return {
			error: {
				_form: ['Failed to create workspace']
			}
		}
	}
}
