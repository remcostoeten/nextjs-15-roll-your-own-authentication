import { NextRequest, NextResponse } from 'next/server';
import { trackPageLeave } from '@/modules/rollyourownanalytics/server/mutations/track-page-leave';

/**
 * Handles POST requests to track when a user leaves a page.
 *
 * Parses the request body for page leave analytics data, validates required fields, and records the event. Returns a JSON response with the tracking result or an error message.
 *
 * @returns A {@link NextResponse} containing the tracking result or an error message.
 */
export async function POST(request: NextRequest) {
	try {
		const body = await request.json();
		const { projectId, sessionId, url, duration, scrollDepth } = body;

		if (!projectId || !sessionId || !url) {
			return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
		}

		const result = await trackPageLeave({
			projectId,
			sessionId,
			url,
			duration: duration || 0,
			scrollDepth: scrollDepth || 0,
		});

		return NextResponse.json(result);
	} catch (error) {
		console.error('Error in page-leave API:', error);
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
	}
}
