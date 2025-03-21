import { NextResponse } from 'next/server'
import { fetchLatestCommits } from '@/app/actions/github'

export async function GET() {
	try {
		const result = await fetchLatestCommits('remcostoeten/nextjs-15-roll-your-own-authentication', 'main', 1)
		return NextResponse.json(result)
	} catch (error) {
		return NextResponse.json(
			{ error: error instanceof Error ? error.message : 'Failed to fetch commit' },
			{ status: 500 }
		)
	}
}
