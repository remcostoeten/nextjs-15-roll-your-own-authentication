import { NextRequest, NextResponse } from 'next/server';
import { trackPageview } from '@/modules/rollyourownanalytics/server/mutations/track-pageview';

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
