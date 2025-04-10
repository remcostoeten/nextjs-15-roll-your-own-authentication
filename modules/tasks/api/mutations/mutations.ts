'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { db } from '@/server/db'
import {
	tasks,
	workspaceMembers,
	workspaceActivities,
} from '@/server/db/schema'
import { eq, and } from 'drizzle-orm'
import { createId } from '@paralleldrive/cuid2'
import { getCurrentUser } from '@/modules/authentication/utilities/auth'

// Task validation schemas
const createTaskSchema = z.object({
	title: z.string().min(1, 'Title is required'),
	description: z.string().optional(),
	status: z.enum(['todo', 'in_progress', 'done']).default('todo'),
	priority: z.enum(['low', 'medium', 'high']).default('medium'),
	dueDate: z.string().optional(),
	assignedToId: z.string().optional(),
})

const updateTaskSchema = z.object({
	title: z.string().min(1, 'Title is required'),
	description: z.string().optional(),
	status: z.enum(['todo', 'in_progress', 'done']),
	priority: z.enum(['low', 'medium', 'high']),
	dueDate: z.string().optional(),
	assignedToId: z.string().optional(),
})

export async function createTask(workspaceId: string, formData: FormData) {
	const user = await getCurrentUser()

	if (!user) {
		return { error: 'You must be logged in' }
	}

	try {
		const validatedData = createTaskSchema.parse({
			title: formData.get('title'),
			description: formData.get('description'),
			status: formData.get('status') || 'todo',
			priority: formData.get('priority') || 'medium',
			dueDate: formData.get('dueDate'),
			assignedToId: formData.get('assignedToId'),
		})

		// Check if user is a member of the workspace
		const membership = await db.query.workspaceMembers.findFirst({
			where: and(
				eq(workspaceMembers.workspaceId, workspaceId),
				eq(workspaceMembers.userId, user.id)
			),
		})

		if (!membership) {
			return {
				error: "You don't have permission to create tasks in this workspace",
			}
		}

		// Create task
		const taskId = createId()
		const [task] = await db
			.insert(tasks)
			.values({
				id: taskId,
				workspaceId,
				title: validatedData.title,
				description: validatedData.description || '',
				status: validatedData.status,
				priority: validatedData.priority,
				dueDate: validatedData.dueDate
					? new Date(validatedData.dueDate)
					: null,
				assignedToId: validatedData.assignedToId || null,
				createdById: user.id,
				createdAt: new Date(),
				updatedAt: new Date(),
			})
			.returning()

		// Create activity
		const activityId = createId()
		await db.insert(workspaceActivities).values({
			id: activityId,
			workspaceId,
			userId: user.id,
			type: 'system',
			content: `Created task: ${validatedData.title}`,
			metadata: {
				taskId: task.id,
				taskTitle: validatedData.title,
				assignedToId: validatedData.assignedToId,
			},
			createdAt: new Date(),
		})

		revalidatePath(`/dashboard/workspaces/${workspaceId}/tasks`)

		return { success: true, taskId: task.id }
	} catch (error) {
		if (error instanceof z.ZodError) {
			return { error: error.errors[0].message }
		}
		return { error: 'Failed to create task' }
	}
}

export async function updateTask(taskId: string, formData: FormData) {
	const user = await getCurrentUser()

	if (!user) {
		return { error: 'You must be logged in' }
	}

	try {
		const validatedData = updateTaskSchema.parse({
			title: formData.get('title'),
			description: formData.get('description'),
			status: formData.get('status'),
			priority: formData.get('priority'),
			dueDate: formData.get('dueDate'),
			assignedToId: formData.get('assignedToId'),
		})

		// Get task
		const task = await db.query.tasks.findFirst({
			where: eq(tasks.id, taskId),
		})

		if (!task) {
			return { error: 'Task not found' }
		}

		// Check if user is a member of the workspace
		const membership = await db.query.workspaceMembers.findFirst({
			where: and(
				eq(workspaceMembers.workspaceId, task.workspaceId),
				eq(workspaceMembers.userId, user.id)
			),
		})

		if (!membership) {
			return {
				error: "You don't have permission to update tasks in this workspace",
			}
		}

		// Check if status changed to "done" to set completedAt
		const completedAt =
			validatedData.status === 'done' && task.status !== 'done'
				? new Date()
				: validatedData.status !== 'done' && task.status === 'done'
					? null
					: task.completedAt

		// Update task
		await db
			.update(tasks)
			.set({
				title: validatedData.title,
				description: validatedData.description || '',
				status: validatedData.status,
				priority: validatedData.priority,
				dueDate: validatedData.dueDate
					? new Date(validatedData.dueDate)
					: null,
				assignedToId: validatedData.assignedToId || null,
				completedAt,
				updatedAt: new Date(),
			})
			.where(eq(tasks.id, taskId))

		// Create activity
		const activityId = createId()
		await db.insert(workspaceActivities).values({
			id: activityId,
			workspaceId: task.workspaceId,
			userId: user.id,
			type: 'system',
			content: `Updated task: ${validatedData.title}`,
			metadata: {
				taskId,
				taskTitle: validatedData.title,
				status: validatedData.status,
				assignedToId: validatedData.assignedToId,
			},
			createdAt: new Date(),
		})

		revalidatePath(`/dashboard/workspaces/${task.workspaceId}/tasks`)

		return { success: true }
	} catch (error) {
		if (error instanceof z.ZodError) {
			return { error: error.errors[0].message }
		}
		return { error: 'Failed to update task' }
	}
}

export async function deleteTask(taskId: string) {
	const user = await getCurrentUser()

	if (!user) {
		return { error: 'You must be logged in' }
	}

	try {
		// Get task
		const task = await db.query.tasks.findFirst({
			where: eq(tasks.id, taskId),
		})

		if (!task) {
			return { error: 'Task not found' }
		}

		// Check if user is a member of the workspace
		const membership = await db.query.workspaceMembers.findFirst({
			where: and(
				eq(workspaceMembers.workspaceId, task.workspaceId),
				eq(workspaceMembers.userId, user.id)
			),
		})

		if (!membership) {
			return {
				error: "You don't have permission to delete tasks in this workspace",
			}
		}

		// Delete task
		await db.delete(tasks).where(eq(tasks.id, taskId))

		// Create activity
		const activityId = createId()
		await db.insert(workspaceActivities).values({
			id: activityId,
			workspaceId: task.workspaceId,
			userId: user.id,
			type: 'system',
			content: `Deleted task: ${task.title}`,
			createdAt: new Date(),
		})

		revalidatePath(`/dashboard/workspaces/${task.workspaceId}/tasks`)

		return { success: true }
	} catch (error) {
		return { error: 'Failed to delete task' }
	}
}
