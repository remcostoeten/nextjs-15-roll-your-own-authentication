import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/modules/authenticatie/helpers/session';
import { updateWorkspace } from '@/modules/workspaces/server/mutations/update-workspace';
import { deleteWorkspace } from '@/modules/workspaces/server/mutations/delete-workspace';

interface RouteParams {
	params: { id: string };
}

// GET /api/workspaces/[id] - Get workspace details
export async function GET(request: NextRequest, { params }: RouteParams) {
	try {
		const session = await getSession();
		
		if (!session?.id) {
			return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
		}

		// TODO: Implement get single workspace query
		return NextResponse.json({ 
			message: 'Get workspace endpoint - coming soon',
			workspaceId: params.id 
		});
	} catch (error) {
		console.error('Error fetching workspace:', error);
		return NextResponse.json(
			{ error: 'Internal server error' }, 
			{ status: 500 }
		);
	}
}

// PUT /api/workspaces/[id] - Update workspace
export async function PUT(request: NextRequest, { params }: RouteParams) {
	try {
		const session = await getSession();
		
		if (!session?.id) {
			return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
		}

		const formData = await request.formData();
		const result = await updateWorkspace(params.id, formData);
		
		if (result.success) {
			return NextResponse.json({ 
				workspace: result.data,
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
		console.error('Error updating workspace:', error);
		return NextResponse.json(
			{ error: 'Internal server error' }, 
			{ status: 500 }
		);
	}
}

// DELETE /api/workspaces/[id] - Delete workspace
export async function DELETE(request: NextRequest, { params }: RouteParams) {
	try {
		const session = await getSession();
		
		if (!session?.id) {
			return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
		}

		const result = await deleteWorkspace(params.id);
		
		if (result.success) {
			return NextResponse.json({ 
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
		console.error('Error deleting workspace:', error);
		return NextResponse.json(
			{ error: 'Internal server error' }, 
			{ status: 500 }
		);
	}
}
