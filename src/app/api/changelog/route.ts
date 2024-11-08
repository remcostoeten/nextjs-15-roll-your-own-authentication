import { NextResponse } from 'next/server'

type GitHubFileChange = {
	filename: string
	additions: number
	deletions: number
	changes: number
	status: string
	patch?: string
}

type GitHubCommitResponse = {
	sha: string
	commit: {
		message: string
		author: {
			name: string
			email: string
			date: string
		}
	}
	stats: {
		additions: number
		deletions: number
		total: number
	}
	files: GitHubFileChange[]
	author: {
		login: string
	}
	parents: Array<{ sha: string }>
}

/**
 * Fetches changelog data from GitHub and Vercel APIs
 * @author Remco Stoeten
 */
export async function GET() {
	try {
		const githubToken = process.env.GITHUB_PAT

		if (!githubToken) {
			throw new Error('Missing GitHub token')
		}

		// First fetch commit list
		const commitsResponse = await fetch(
			'https://api.github.com/repos/remcostoeten/nextjs-15-roll-your-own-authentication/commits',
			{
				headers: {
					Authorization: `Bearer ${githubToken}`,
					Accept: 'application/vnd.github.v3+json'
				},
				next: { revalidate: 300 }
			}
		)

		if (!commitsResponse.ok) {
			throw new Error(`GitHub API error: ${commitsResponse.status}`)
		}

		const commits = await commitsResponse.json()

		// Fetch detailed information for each commit
		const detailedCommits = await Promise.all(
			commits.map(async (commit: GitHubCommitResponse) => {
				const detailResponse = await fetch(
					`https://api.github.com/repos/remcostoeten/nextjs-15-roll-your-own-authentication/commits/${commit.sha}`,
					{
						headers: {
							Authorization: `Bearer ${githubToken}`,
							Accept: 'application/vnd.github.v3+json'
						},
						next: { revalidate: 300 }
					}
				)

				if (!detailResponse.ok) {
					return null
				}

				return await detailResponse.json()
			})
		)

		// Transform the commits data
		// Only fetch Vercel deployments if we have the required credentials
		let deployments = []
		if (vercelToken && vercelProjectId) {
			const vercelResponse = await fetch(
				`https://api.vercel.com/v6/deployments?projectId=${vercelProjectId}`,
				{
					headers: {
						Authorization: `Bearer ${vercelToken}`
					},
					next: { revalidate: 300 }
				}
			)

			if (vercelResponse.ok) {
				const vercelData = await vercelResponse.json()
				deployments = vercelData.deployments
			}
		}

		// Transform GitHub commits data
		const transformedCommits = commits.map((commit: any) => ({
			id: commit.sha,
			message: commit.commit.message,
			date: commit.commit.author.date,
			status: commit.state || 'unknown',
			author: {
				name: commit.commit.author.name,
				email: commit.commit.author.email
			},
			stats: {
				additions: commit.stats?.additions || 0,
				deletions: commit.stats?.deletions || 0
			},
			files:
				commit.files?.map((file: any) => ({
					filename: file.filename,
					changes: (file.additions || 0) + (file.deletions || 0)
				})) || []
		}))

		return NextResponse.json({
			commits: transformedCommits,
			deployments
		})
	} catch (error) {
		console.error('Changelog API Error:', error)
		return NextResponse.json(
			{ error: 'Failed to fetch changelog data' },
			{ status: 500 }
		)
	}
}
