'use server'

import { db } from 'db'
import { widgetTodos } from '@/server/db/schemas/widget-todos'
import { eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const updateTodoSchema = z.object({
	title: z.string().min(1, 'Title is required'),
})

export type UpdateTodoFormState = {
	success: boolean
	message: string | null
}

export async function updateTodoMutation(
	id: string,
	formData: FormData
): Promise<UpdateTodoFormState> {
	try {
		const rawData = Object.fromEntries(formData.entries())
		const validatedData = updateTodoSchema.parse(rawData)

		await db
			.update(widgetTodos)
			.set({ title: validatedData.title })
			.where(eq(widgetTodos.id, id))

		revalidatePath('/')

		return {
			success: true,
			message: null,
		}
	} catch (error) {
		console.error('Update todo error:', error)
		return {
			success: false,
			message:
				error instanceof Error
					? error.message
					: 'Failed to update todo',
		}
	}
}
