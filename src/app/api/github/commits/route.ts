import { fetchCommitData } from '@/modules/landing/components/api/cache-services';
import { fallbackCommitData } from '@/modules/landing/components/api/fallback-data';
import { NextResponse } from 'next/server';

export const runtime = 'edge';
export const revalidate = 3600;

export async function GET() {
	try {
		const data = await fetchCommitData();
		return NextResponse.json(data, {
			headers: {
				'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
			},
		});
	} catch (error) {
		console.error('Error in /api/github/commits:', error);
		return NextResponse.json(fallbackCommitData, {
			status: 200,
			headers: {
				'Cache-Control': 'public, s-maxage=300',
			},
		});
	}
}
