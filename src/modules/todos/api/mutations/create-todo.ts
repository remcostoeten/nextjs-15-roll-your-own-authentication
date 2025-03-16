'use server'

import { db } from 'db'
import { widgetTodos } from '@/server/db/schemas/widget-todos'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { createId } from '@paralleldrive/cuid2'
import { getCurrentUser } from '@/modules/authentication/api/queries/get-current-user'

const createTodoSchema = z.object({
	title: z.string().min(1, 'Title is required'),
	content: z.string().optional(),
	tags: z.string().transform((tags) => {
		if (!tags) return []
		return tags
			.split(',')
			.map((tag) => tag.trim())
			.filter(Boolean)
	}),
	priority: z.string().transform((priority) => parseInt(priority)),
})

export type CreateTodoFormState = {
	success: boolean
	message: string | null
}

export async function createTodoMutation(
	prevState: CreateTodoFormState,
	formData: FormData
): Promise<CreateTodoFormState> {
	try {
		const { success, user } = await getCurrentUser()
		if (!success || !user) {
			return {
				success: false,
				message: 'You must be logged in to create a todo',
			}
		}

		const rawData = Object.fromEntries(formData.entries())
		const validatedData = createTodoSchema.parse(rawData)

		await db.insert(widgetTodos).values({
			id: createId(),
			title: validatedData.title,
			content: validatedData.content || null,
			tags: JSON.stringify(validatedData.tags),
			priority: validatedData.priority,
			userId: user.id,
		})

		revalidatePath('/')

		return {
			success: true,
			message: null,
		}
	} catch (error) {
		console.error('Create todo error:', error)

		if (error instanceof z.ZodError) {
			const firstError = error.errors[0]
			return {
				success: false,
				message: firstError.message,
			}
		}

		return {
			success: false,
			message:
				error instanceof Error
					? error.message
					: 'Failed to create todo',
		}
	}
}
