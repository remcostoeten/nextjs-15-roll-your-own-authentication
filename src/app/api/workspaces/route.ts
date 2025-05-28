import { NextResponse } from 'next/server';
import { getSession } from '@/modules/authenticatie/helpers/session';
import { getUserWorkspaces } from '@/modules/workspaces/server/queries/get-user-workspaces';

export async function GET() {
	try {
		const session = await getSession();
		
		if (!session?.id) {
			return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
		}

		const workspaces = await getUserWorkspaces();
		
		return NextResponse.json({ 
			workspaces,
			success: true 
		});
	} catch (error) {
		console.error('Error fetching workspaces:', error);
		return NextResponse.json(
			{ error: 'Internal server error' }, 
			{ status: 500 }
		);
	}
}
