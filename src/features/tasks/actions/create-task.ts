'use server'

import { db } from '@/db'
import { sql } from 'drizzle-orm'
import type { Task } from '../db/schema'
import { tasks } from '../db/schema'
import { createTaskSchema } from '../validations'

export async function createTask(
	formData: FormData
): Promise<{ data?: Task; error?: string }> {
	try {
		const validatedFields = createTaskSchema.safeParse({
			title: formData.get('title'),
			description: formData.get('description'),
			priority: formData.get('priority'),
			dueDate: formData.get('dueDate')
		})

		if (!validatedFields.success) {
			return { error: 'Invalid form data' }
		}

		// Get max position
		const result = await db
			.select({
				maxPosition: sql<number>`COALESCE(MAX(${tasks.position}), -1)`
			})
			.from(tasks)

		const position = (result[0]?.maxPosition ?? -1) + 1

		const [task] = await db
			.insert(tasks)
			.values({
				...validatedFields.data,
				position
			})
			.returning()

		return { data: task }
	} catch (error) {
		console.error('Failed to create task:', error)
		return { error: 'Failed to create task' }
	}
}
