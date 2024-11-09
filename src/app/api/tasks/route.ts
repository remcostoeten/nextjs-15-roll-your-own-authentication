import { db } from '@/db'
import { tasks } from '@/features/tasks/db/schema'
import { NextResponse } from 'next/server'

export async function GET() {
	try {
		const allTasks = await db.select().from(tasks).orderBy(tasks.position)

		return NextResponse.json(allTasks)
	} catch (error) {
		console.error('Failed to fetch tasks:', error)
		return NextResponse.json(
			{ error: 'Failed to fetch tasks' },
			{ status: 500 }
		)
	}
}
