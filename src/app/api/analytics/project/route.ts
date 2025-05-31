import { NextRequest, NextResponse } from 'next/server';
import { getProject } from '@/modules/rollyourownanalytics/server/queries/get-project';
import { createProject } from '@/modules/rollyourownanalytics/server/mutations/create-project';

export async function GET(request: NextRequest) {
	try {
		const { searchParams } = new URL(request.url);
		const projectId = searchParams.get('projectId');

		if (!projectId) {
			return NextResponse.json({ error: 'Project ID is required' }, { status: 400 });
		}

		const project = await getProject(projectId);

		if (!project) {
			return NextResponse.json({ error: 'Project not found' }, { status: 404 });
		}

		return NextResponse.json(project);
	} catch (error) {
		console.error('Error in project GET API:', error);
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
	}
}

export async function POST(request: NextRequest) {
	try {
		const body = await request.json();
		const { name, domain, settings } = body;

		if (!name || !domain) {
			return NextResponse.json({ error: 'Name and domain are required' }, { status: 400 });
		}

		const project = await createProject({ name, domain, settings });

		return NextResponse.json(project);
	} catch (error) {
		console.error('Error in project POST API:', error);
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
	}
}

export async function PUT(request: NextRequest) {
	try {
		const body = await request.json();
		const { projectId, ...updateData } = body;

		if (!projectId) {
			return NextResponse.json({ error: 'Project ID is required' }, { status: 400 });
		}

		// For now, we'll just return the updated data
		// In a real implementation, you'd update the database
		const updatedProject = { projectId, ...updateData };

		return NextResponse.json(updatedProject);
	} catch (error) {
		console.error('Error in project PUT API:', error);
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
	}
}

export async function DELETE(request: NextRequest) {
	try {
		const { searchParams } = new URL(request.url);
		const projectId = searchParams.get('projectId');

		if (!projectId) {
			return NextResponse.json({ error: 'Project ID is required' }, { status: 400 });
		}

		// For now, we'll just return success
		// In a real implementation, you'd delete from the database

		return NextResponse.json({ success: true });
	} catch (error) {
		console.error('Error in project DELETE API:', error);
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
	}
}
