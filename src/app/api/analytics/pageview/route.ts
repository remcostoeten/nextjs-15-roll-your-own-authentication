import { NextRequest, NextResponse } from 'next/server';
import { trackPageview } from '@/modules/rollyourownanalytics/server/mutations/track-pageview';

/**
 * Handles POST requests to track a pageview event.
 *
 * Parses the incoming request body as JSON and processes it using {@link trackPageview}. Returns the tracking result as a JSON response. If an error occurs during parsing or processing, responds with a 500 status code and an error message.
 */
export async function POST(request: NextRequest) {
	try {
		const body = await request.json();

		const result = await trackPageview(body);

		return NextResponse.json(result);
	} catch (error) {
		console.error('Error in pageview API:', error);
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
	}
}
