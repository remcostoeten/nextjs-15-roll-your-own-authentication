'use server'

import { db } from '@/server/db'
import { changelogItems } from '@/server/db/schemas'
import { desc } from 'drizzle-orm'

export type ChangelogItem = {
    id: string
    version: string
    title: string
    description: string
    date: Date
    features: string[]
    improvements: string[]
    bugfixes: string[]
    votes: number
}

/**
 * Get changelog items sorted by date (newest first)
 */
export async function getChangelogItems(): Promise<ChangelogItem[]> {
    try {
        const items = await db.query.changelogItems.findMany({
            orderBy: [desc(changelogItems.date)]
        })

        return items.map(item => ({
            id: item.id,
            version: item.version,
            title: item.title,
            description: item.description,
            date: new Date(item.date),
            features: item.features ? JSON.parse(item.features) : [],
            improvements: item.improvements ? JSON.parse(item.improvements) : [],
            bugfixes: item.bugfixes ? JSON.parse(item.bugfixes) : [],
            votes: item.votes || 0
        }))
    } catch (error) {
        console.error('Error fetching changelog items:', error)
        return []
    }
} 