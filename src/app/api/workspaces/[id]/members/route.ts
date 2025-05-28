import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/modules/authenticatie/helpers/session';
import { getWorkspaceMembers } from '@/modules/workspaces/server/queries/get-workspace-members';
import { inviteUser } from '@/modules/workspaces/server/mutations/invite-user';

interface RouteParams {
	params: { id: string };
}

// GET /api/workspaces/[id]/members - Get workspace members
export async function GET(request: NextRequest, { params }: RouteParams) {
	try {
		const session = await getSession();
		
		if (!session?.id) {
			return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
		}

		const members = await getWorkspaceMembers(params.id);
		
		return NextResponse.json({ 
			members,
			success: true 
		});
	} catch (error) {
		console.error('Error fetching workspace members:', error);
		return NextResponse.json(
			{ error: 'Internal server error' }, 
			{ status: 500 }
		);
	}
}

// POST /api/workspaces/[id]/members - Invite member
export async function POST(request: NextRequest, { params }: RouteParams) {
	try {
		const session = await getSession();
		
		if (!session?.id) {
			return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
		}

		const formData = await request.formData();
		formData.append('workspaceId', params.id);
		
		const result = await inviteUser(formData);
		
		if (result.success) {
			return NextResponse.json({ 
				invite: result.data,
				message: result.message,
				success: true 
			});
		} else {
			return NextResponse.json(
				{ error: result.error }, 
				{ status: 400 }
			);
		}
	} catch (error) {
		console.error('Error inviting member:', error);
		return NextResponse.json(
			{ error: 'Internal server error' }, 
			{ status: 500 }
		);
	}
}
