import { getSession } from '@/modules/authenticatie/helpers/session';
import { NextResponse } from 'next/server';

export async function GET() {
	const session = await getSession();

	if (!session) {
		return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
	}

	return NextResponse.json({
		id: session.id,
		email: session.email,
		role: session.role,
		name: session.name || null,
		avatar: session.avatar || null,
		createdAt: session.createdAt || null,
		updatedAt: session.updatedAt || null,
	});
}
