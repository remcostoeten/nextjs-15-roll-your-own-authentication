'use server'

import { db } from '@/db'
import { eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { tasks } from '../db/schema'

export async function updateTaskPositions(
	updates: { id: string; position: number }[]
) {
	try {
		await db.transaction(async (tx) => {
			for (const { id, position } of updates) {
				await tx
					.update(tasks)
					.set({
						position,
						updatedAt: new Date().toISOString()
					})
					.where(eq(tasks.id, id))
			}
		})

		revalidatePath('/dashboard')
		return { success: true }
	} catch (error) {
		console.error('Failed to update task positions:', error)
		return { success: false, error: 'Failed to update positions' }
	}
}
