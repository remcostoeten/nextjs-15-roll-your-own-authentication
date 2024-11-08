import { NextResponse } from 'next/server'

export async function GET() {
	try {
		if (!process.env.VERCEL_TOKEN || !process.env.VERCEL_PROJECT_ID) {
			throw new Error('Missing Vercel credentials')
		}

		const response = await fetch(
			`https://api.vercel.com/v6/deployments?projectId=${process.env.VERCEL_PROJECT_ID}&limit=10&state=READY`,
			{
				headers: {
					Authorization: `Bearer ${process.env.VERCEL_TOKEN}`,
					'Content-Type': 'application/json'
				},
				next: {
					revalidate: 60,
					tags: ['vercel-deployments']
				}
			}
		)

		if (!response.ok) {
			const errorData = await response.json().catch(() => ({}))
			console.error('Vercel API Error:', {
				status: response.status,
				statusText: response.statusText,
				error: errorData
			})
			throw new Error(
				`Vercel API responded with status ${response.status}`
			)
		}

		const data = await response.json()

		if (!data.deployments || !Array.isArray(data.deployments)) {
			throw new Error('Invalid response format from Vercel API')
		}

		const formattedDeployments = data.deployments
			.filter((d) => d.state === 'READY')
			.map((deployment) => ({
				uid: deployment.uid || '',
				name: deployment.name || 'Unnamed Deployment',
				url: deployment.url || '',
				created: deployment.createdAt || Date.now(),
				state: deployment.state?.toLowerCase() || 'unknown'
			}))
			.slice(0, 10)

		return NextResponse.json(formattedDeployments)
	} catch (error) {
		console.error('Error fetching Vercel deployments:', error)
		return NextResponse.json(
			{ error: 'Failed to fetch deployments' },
			{
				status:
					error instanceof Error &&
					error.message.includes('credentials')
						? 401
						: 500
			}
		)
	}
}
