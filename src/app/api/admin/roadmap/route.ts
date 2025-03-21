import { NextResponse } from 'next/server'
import { z } from 'zod'
import { db } from '@/server/db'
import { roadmapItems } from '@/server/db/schemas/roadmap.schema'
import { getServerSession } from 'next-auth/next'
import { eq } from 'drizzle-orm'

const roadmapItemSchema = z.object({
    title: z.string().min(1),
    description: z.string().min(1),
    status: z.enum(['planned', 'in-progress', 'completed']),
    priority: z.number().int().min(0),
    quarter: z.string().min(1),
})

export async function POST(req: Request) {
    try {
        const session = await getServerSession()
        
        if (!session || session.user?.email !== process.env.ADMIN_EMAIL) {
            return new NextResponse('Unauthorized', { status: 401 })
        }

        const body = await req.json()
        const validatedData = roadmapItemSchema.parse(body)

        const newItem = await db.insert(roadmapItems).values({
            ...validatedData,
            votes: 0,
        }).returning()

        return NextResponse.json(newItem[0])
    } catch (error) {
        console.error('Error adding roadmap item:', error)
        return new NextResponse(
            error instanceof z.ZodError 
                ? JSON.stringify(error.errors) 
                : 'Internal Server Error',
            { status: error instanceof z.ZodError ? 400 : 500 }
        )
    }
}

export async function PUT(req: Request) {
    try {
        const session = await getServerSession()
        
        if (!session || session.user?.email !== process.env.ADMIN_EMAIL) {
            return new NextResponse('Unauthorized', { status: 401 })
        }

        const body = await req.json()
        const { id, ...updateData } = body
        
        if (!id) {
            return new NextResponse('Missing ID', { status: 400 })
        }

        const validatedData = roadmapItemSchema.partial().parse(updateData)

        const updatedItem = await db.update(roadmapItems)
            .set({
                ...validatedData,
                updatedAt: new Date().toISOString(),
            })
            .where(eq(roadmapItems.id, id))
            .returning()

        return NextResponse.json(updatedItem[0])
    } catch (error) {
        console.error('Error updating roadmap item:', error)
        return new NextResponse(
            error instanceof z.ZodError 
                ? JSON.stringify(error.errors) 
                : 'Internal Server Error',
            { status: error instanceof z.ZodError ? 400 : 500 }
        )
    }
}

export async function DELETE(req: Request) {
    try {
        const session = await getServerSession()
        
        if (!session || session.user?.email !== process.env.ADMIN_EMAIL) {
            return new NextResponse('Unauthorized', { status: 401 })
        }

        const { searchParams } = new URL(req.url)
        const id = searchParams.get('id')

        if (!id) {
            return new NextResponse('Missing ID', { status: 400 })
        }

        await db.delete(roadmapItems).where(eq(roadmapItems.id, id))

        return new NextResponse(null, { status: 204 })
    } catch (error) {
        console.error('Error deleting roadmap item:', error)
        return new NextResponse('Internal Server Error', { status: 500 })
    }
} 