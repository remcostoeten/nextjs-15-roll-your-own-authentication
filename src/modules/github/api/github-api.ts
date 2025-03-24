import { z } from 'zod'

const githubErrorSchema = z.object({
	message: z.string(),
	documentation_url: z.string().optional(),
})

export class GitHubApiError extends Error {
	constructor(
		message: string,
		public status: number
	) {
		super(message)
		this.name = 'GitHubApiError'
	}
}

export class GitHubApi {
	private static instance: GitHubApi
	private token: string

	private constructor() {
		this.token = process.env.GITHUB_TOKEN || ''
		if (!this.token) {
			console.warn(
				'GITHUB_TOKEN is not set. GitHub API calls may be rate limited.'
			)
		}
	}

	public static getInstance(): GitHubApi {
		if (!GitHubApi.instance) {
			GitHubApi.instance = new GitHubApi()
		}
		return GitHubApi.instance
	}

	private async fetch<T>(
		endpoint: string,
		options: RequestInit = {}
	): Promise<T> {
		const url = `https://api.github.com${endpoint}`
		const headers = {
			Accept: 'application/vnd.github.v3+json',
			Authorization: `token ${this.token}`,
			...options.headers,
		}

		const response = await fetch(url, {
			...options,
			headers,
			next: { revalidate: 3600 }, // Cache for 1 hour
		})

		if (!response.ok) {
			const error = await response.json()
			const parsed = githubErrorSchema.safeParse(error)
			const message = parsed.success
				? parsed.data.message
				: 'Unknown GitHub API error'
			throw new GitHubApiError(message, response.status)
		}

		return response.json()
	}

	async getRepository(owner: string, repo: string) {
		return this.fetch<{
			name: string
			description: string
			created_at: string
			updated_at: string
			stargazers_count: number
			forks_count: number
			default_branch: string
			language: string
			languages_url: string
		}>(`/repos/${owner}/${repo}`)
	}

	async getLanguages(owner: string, repo: string) {
		return this.fetch<Record<string, number>>(
			`/repos/${owner}/${repo}/languages`
		)
	}

	async getBranches(owner: string, repo: string) {
		return this.fetch<Array<{ name: string }>>(
			`/repos/${owner}/${repo}/branches`
		)
	}

	async getContributors(owner: string, repo: string) {
		return this.fetch<Array<{ login: string }>>(
			`/repos/${owner}/${repo}/contributors`
		)
	}

	async getCommits(owner: string, repo: string, branch = 'main', count = 5) {
		return this.fetch<
			Array<{
				sha: string
				commit: {
					message: string
					author: {
						name: string
						date: string
					}
				}
				html_url: string
				author: {
					login: string
					avatar_url: string
				}
			}>
		>(`/repos/${owner}/${repo}/commits?sha=${branch}&per_page=${count}`)
	}
}
