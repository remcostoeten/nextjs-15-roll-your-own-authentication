import { NextRequest, NextResponse } from 'next/server';
import { getProject } from '@/modules/rollyourownanalytics/server/queries/get-project';
import { createProject } from '@/modules/rollyourownanalytics/server/mutations/create-project';

/**
 * Handles GET requests to retrieve a project by its ID.
 *
 * Extracts the `projectId` from the request's query parameters and returns the corresponding project data as JSON.
 * Responds with a 400 error if `projectId` is missing, a 404 error if the project does not exist, or a 500 error on server failure.
 */
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

/**
 * Handles HTTP POST requests to create a new project.
 *
 * Expects a JSON body containing `name`, `domain`, and optional `settings`. Returns the created project as JSON on success, or an error response if required fields are missing or an internal error occurs.
 */
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

/**
 * Handles HTTP PUT requests to update a project's data.
 *
 * Parses the request body for a {@link projectId} and update fields, returning the combined updated project data as JSON. Does not perform a database update.
 *
 * @returns The updated project data as a JSON response, or an error message with appropriate HTTP status code if validation fails or an internal error occurs.
 */
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

/**
 * Handles HTTP DELETE requests to remove a project by its ID.
 *
 * Expects a `projectId` query parameter in the request URL. Returns a success response if provided, or a 400 error if missing.
 *
 * @returns A JSON response indicating success, or an error message with the appropriate HTTP status code.
 *
 * @remark This handler does not perform an actual deletion; it only returns a mock success response.
 */
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
