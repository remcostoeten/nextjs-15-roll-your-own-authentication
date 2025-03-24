import { db } from '@/server/db'
import { roadmapItems } from '@/server/db/schemas/roadmap'
import { desc } from 'drizzle-orm'
import { NextResponse } from 'next/server'

export async function GET() {
	try {
		const items = await db.select().from(roadmapItems).orderBy(desc(roadmapItems.priority))
		return NextResponse.json(items)
	} catch (error) {
		console.error('Error fetching roadmap items:', error)
		return NextResponse.json({ error: 'Failed to fetch roadmap items' }, { status: 500 })
	}
}
