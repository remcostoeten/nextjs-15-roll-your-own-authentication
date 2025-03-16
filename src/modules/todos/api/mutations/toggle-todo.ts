'use server'

import { db } from 'db'
import { widgetTodos } from '@/server/db/schemas/widget-todos'
import { eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'

export async function toggleTodoMutation(id: string) {
	try {
		const todo = await db.query.widgetTodos.findFirst({
			where: (todos, { eq }) => eq(todos.id, id),
		})

		if (!todo) {
			return {
				success: false,
				message: 'Todo not found',
			}
		}

		await db
			.update(widgetTodos)
			.set({ completed: !todo.completed })
			.where(eq(widgetTodos.id, id))

		revalidatePath('/')

		return {
			success: true,
			message: null,
		}
	} catch (error) {
		console.error('Failed to toggle todo:', error)
		return {
			success: false,
			message:
				error instanceof Error
					? error.message
					: 'Failed to toggle todo',
		}
	}
}
