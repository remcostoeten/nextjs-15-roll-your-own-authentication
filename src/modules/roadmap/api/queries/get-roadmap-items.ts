'use server'

import { db, roadmapItems } from '@/server/db'
import { asc } from 'drizzle-orm'

export type RoadmapItem = {
	id: string
	title: string
	description: string
	status: 'planned' | 'in-progress' | 'completed'
	priority: number
	startDate: string | null
	endDate: string | null
	quarter: string
	votes: number
	assignee: string | null
	tags: string | null
	dependencies: string | null
	progress: number
}

/**
 * Get roadmap items sorted by priority and quarter
 */
export async function getRoadmapItems(): Promise<RoadmapItem[]> {
	try {
		const items = await db.query.roadmapItems.findMany({
			orderBy: [asc(roadmapItems.quarter), asc(roadmapItems.priority)],
		})

		return items.map((item) => ({
			id: item.id,
			title: item.title,
			description: item.description,
			status: item.status as 'planned' | 'in-progress' | 'completed',
			priority: item.priority || 0,
			startDate: item.startDate,
			endDate: item.endDate,
			quarter: item.quarter,
			votes: item.votes || 0,
			assignee: item.assignee,
			tags: item.tags,
			dependencies: item.dependencies,
			progress: item.progress || 0,
		}))
	} catch (error) {
		console.error('Error fetching roadmap items:', error)
		return []
	}
}
