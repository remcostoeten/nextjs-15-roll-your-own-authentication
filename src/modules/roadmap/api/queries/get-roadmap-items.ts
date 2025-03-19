'use server'

import { db } from '@/server/db'
import { roadmapItems } from '@/server/db/schemas'
import { asc } from 'drizzle-orm'

export type RoadmapItem = {
    id: string
    title: string
    description: string
    status: 'planned' | 'in-progress' | 'completed'
    priority: number
    quarter: string
    votes: number
}

/**
 * Get roadmap items sorted by priority and quarter
 */
export async function getRoadmapItems(): Promise<RoadmapItem[]> {
    try {
        const items = await db.query.roadmapItems.findMany({
            orderBy: [
                asc(roadmapItems.quarter),
                asc(roadmapItems.priority)
            ]
        })

        return items.map(item => ({
            id: item.id,
            title: item.title,
            description: item.description,
            status: item.status as 'planned' | 'in-progress' | 'completed',
            priority: item.priority || 0,
            quarter: item.quarter,
            votes: item.votes || 0,
        }))
    } catch (error) {
        console.error('Error fetching roadmap items:', error)
        return []
    }
} 