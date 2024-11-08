import { Octokit } from '@octokit/rest'
import { NextResponse } from 'next/server'

export async function GET() {
	try {
		if (!process.env.GITHUB_PAT) {
			throw new Error('GitHub PAT not configured')
		}

		const octokit = new Octokit({
			auth: process.env.GITHUB_PAT
		})

		const response = await octokit.repos.listCommits({
			owner: 'remcostoeten',
			repo: 'nextjs-15-roll-your-own-authentication',
			per_page: 10
		})

		if (!response.data || !Array.isArray(response.data)) {
			throw new Error('Invalid response format from GitHub API')
		}

		// Get detailed information for each commit
		const detailedCommits = await Promise.all(
			response.data.map(async (commit) => {
				const detail = await octokit.repos.getCommit({
					owner: 'remcostoeten',
					repo: 'nextjs-15-roll-your-own-authentication',
					ref: commit.sha
				})

				// Extract branch information from merge commit message
				let merge
				if (commit.parents.length > 1) {
					const mergeMatch = commit.commit.message.match(
						/Merge (?:branch|pull request) '([^']+)' into '?([^'\n]+)'?/
					)
					if (mergeMatch) {
						merge = {
							fromBranch: mergeMatch[1],
							intoBranch: mergeMatch[2]
						}
					}
				}

				return {
					sha: commit.sha,
					commit: {
						message: commit.commit.message,
						author: {
							name: commit.commit.author?.name || null,
							email: commit.commit.author?.email || null,
							date: commit.commit.author?.date || null
						}
					},
					stats: detail.data.stats || {
						additions: 0,
						deletions: 0,
						total: 0
					},
					files:
						detail.data.files?.map((file) => ({
							filename: file.filename,
							additions: file.additions || 0,
							deletions: file.deletions || 0,
							changes: file.changes || 0,
							status: file.status || 'modified',
							patch: file.patch
						})) || [],
					parents: commit.parents || [],
					merge
				}
			})
		)

		return NextResponse.json(detailedCommits)
	} catch (error) {
		console.error('Error fetching GitHub commits:', error)
		return NextResponse.json(
			{ error: 'Failed to fetch commits' },
			{
				status:
					error instanceof Error && error.message.includes('PAT')
						? 401
						: 500
			}
		)
	}
}
