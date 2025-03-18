'use server'

import { db } from 'db'
import { widgetTodos } from '@/server/db/schemas/widget-todos'
import { eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'

export async function deleteTodoMutation(id: string) {
	try {
		await db.delete(widgetTodos).where(eq(widgetTodos.id, id))
		revalidatePath('/')
		return { success: true }
	} catch (error) {
		console.error('Delete todo error:', error)
		return { success: false }
	}
}
