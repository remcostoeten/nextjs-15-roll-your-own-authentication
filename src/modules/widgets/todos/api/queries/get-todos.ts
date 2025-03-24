'use server'

import { db } from 'db'
import { widgetTodos } from '@/server/db/schemas/widget-todos'
import { desc, eq } from 'drizzle-orm'
import { getCurrentUser } from '@/modules/authentication/api/queries/get-current-user'
import type { Todo } from '@/server/db/schemas/widget-todos'

export type GetTodosResponse = {
	success: boolean
	message: string | null
	todos: Todo[]
}

export async function getTodos(): Promise<GetTodosResponse> {
	try {
		const { success, user } = await getCurrentUser()
		if (!success || !user) {
			return {
				success: false,
				message: 'You must be logged in to view todos',
				todos: [],
			}
		}

		const todos = await db
			.select()
			.from(widgetTodos)
			.where(eq(widgetTodos.userId, user.id))
			.orderBy(desc(widgetTodos.createdAt))

		return {
			success: true,
			message: null,
			todos,
		}
	} catch (error) {
		console.error('Get todos error:', error)
		return {
			success: false,
			message: error instanceof Error ? error.message : 'Failed to fetch todos',
			todos: [],
		}
	}
}
