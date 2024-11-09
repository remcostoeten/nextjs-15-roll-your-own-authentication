import fs from 'fs/promises'
import { NextRequest, NextResponse } from 'next/server'
import path from 'path'

export async function GET(request: NextRequest) {
	try {
		const searchParams = request.nextUrl.searchParams
		const diffPath = searchParams.get('path')

		if (!diffPath) {
			return NextResponse.json(
				{ error: 'No diff path provided' },
				{ status: 400 }
			)
		}

		// Ensure the path is within your project's diffs directory
		const safePath = path.join(process.cwd(), 'diffs', diffPath)

		// Basic path traversal protection
		if (!safePath.startsWith(path.join(process.cwd(), 'diffs'))) {
			return NextResponse.json(
				{ error: 'Invalid diff path' },
				{ status: 400 }
			)
		}

		const diffContent = await fs.readFile(safePath, 'utf-8')

		return new NextResponse(diffContent, {
			headers: {
				'Content-Type': 'text/plain'
			}
		})
	} catch (error) {
		console.error('Error reading diff:', error)
		return NextResponse.json(
			{ error: 'Failed to read diff' },
			{ status: 500 }
		)
	}
}
