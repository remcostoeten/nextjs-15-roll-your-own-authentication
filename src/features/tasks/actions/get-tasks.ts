'use server'

import { db } from '@/db'
import { desc } from 'drizzle-orm'
import type { Task } from '../db/schema'
import { tasks } from '../db/schema'

export async function getTasks(): Promise<Task[]> {
	try {
		const allTasks = await db
			.select()
			.from(tasks)
			.orderBy(desc(tasks.position))

		return allTasks
	} catch (error) {
		console.error('Failed to fetch tasks:', error)
		throw new Error('Failed to fetch tasks')
	}
}
