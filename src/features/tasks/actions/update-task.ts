'use server'

import { db } from '@/db'
import { eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import type { Task } from '../db/schema'
import { tasks } from '../db/schema'

export async function updateTaskStatus(id: string, status: Task['status']) {
	try {
		await db
			.update(tasks)
			.set({
				status,
				updatedAt: new Date().toISOString()
			})
			.where(eq(tasks.id, id))

		revalidatePath('/dashboard')
		return { success: true }
	} catch (error) {
		console.error('Failed to update task status:', error)
		return { success: false, error: 'Failed to update status' }
	}
}

export async function updateTaskTimeSpent(id: string, timeSpent: number) {
	try {
		await db
			.update(tasks)
			.set({
				timeSpent,
				updatedAt: new Date().toISOString()
			})
			.where(eq(tasks.id, id))

		revalidatePath('/dashboard')
		return { success: true }
	} catch (error) {
		console.error('Failed to update time spent:', error)
		return { success: false, error: 'Failed to update time spent' }
	}
}

export async function updateTaskPriority(
	id: string,
	priority: Task['priority']
) {
	try {
		await db
			.update(tasks)
			.set({
				priority,
				updatedAt: new Date().toISOString()
			})
			.where(eq(tasks.id, id))

		revalidatePath('/dashboard')
		return { success: true }
	} catch (error) {
		console.error('Failed to update priority:', error)
		return { success: false, error: 'Failed to update priority' }
	}
}
