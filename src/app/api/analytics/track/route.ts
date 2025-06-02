import { NextRequest, NextResponse } from 'next/server';
import { trackEvent } from '@/modules/rollyourownanalytics/server/mutations/track-event';

/**
 * Handles POST requests to track analytics events.
 *
 * Parses the incoming request body as JSON and passes it to the {@link trackEvent} function. Returns the tracking result as a JSON response. If an error occurs during parsing or event tracking, responds with a 500 status and an error message.
 *
 * @returns A JSON response containing the tracking result or an error message.
 */
export async function POST(request: NextRequest) {
	try {
		const body = await request.json();

		const result = await trackEvent(body);

		return NextResponse.json(result);
	} catch (error) {
		console.error('Error in track API:', error);
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
	}
}
