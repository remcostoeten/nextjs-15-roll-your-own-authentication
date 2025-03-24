import { NextResponse, NextRequest } from 'next/server'
import { z } from 'zod'
import { db } from '@/server/db'
import { roadmapItems } from '@/server/db/schemas/roadmap.schema'
import { eq } from 'drizzle-orm'
import { auth } from '@/shared/auth'
import { roadmapItemSchema } from '@/modules/roadmap/models/z.roadmap-item'
import { useAuth, useAuthApi } from '@/modules/authentication'
import { cookies } from 'next/headers'
import { users } from '@/server/db/schemas'
import { verifyAccessToken } from '@/shared/utils/jwt/jwt'

export async function POST(req: NextRequest) {
	try {
		const accessToken = req.cookies.get('access_token')?.value;
		if (!accessToken) {
			return new NextResponse('Unauthorized', { status: 401 });
		}

		try {
			const payload = await verifyAccessToken(accessToken);
			const user = await db.query.users.findFirst({
				where: eq(users.id, payload.sub),
			});

			if (!user || user.role !== 'admin') {
				return new NextResponse('Unauthorized', { status: 401 });
			}

			const body = await req.json();
			const validatedData = roadmapItemSchema.parse(body);

			const newItem = await db
				.insert(roadmapItems)
				.values({
					...validatedData,
					votes: 0,
				})
				.returning();

			return NextResponse.json(newItem[0]);
		} catch (error) {
			if (error instanceof z.ZodError) {
				return new NextResponse(JSON.stringify(error.errors), { status: 400 });
			}
			throw error;
		}
	} catch (error) {
		console.error('Error in roadmap POST:', error);
		return new NextResponse('Internal Server Error', { status: 500 });
	}
}

export async function PUT(req: Request) {
	try {
		const session = await auth()

		if (!session || session.user.role !== 'admin') {
			return new NextResponse('Unauthorized', { status: 401 })
		}

		const body = await req.json()
		const { id, ...updateData } = body

		if (!id) {
			return new NextResponse('Missing ID', { status: 400 })
		}

		const validatedData = roadmapItemSchema.partial().parse(updateData)

		const updatedItem = await db
			.update(roadmapItems)
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
		const session = await auth()

		if (!session || session.user.role !== 'admin') {
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
