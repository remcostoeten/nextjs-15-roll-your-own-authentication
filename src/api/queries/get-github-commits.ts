'use server';

import { cache } from 'react';

const GITHUB_API_BASE = 'https://api.github.com';
const REPO_OWNER = 'remcostoeten';
const REPO_NAME = 'nextjs-15-roll-your-own-authentication';

type TGitHubError = {
	message: string;
	documentation_url?: string;
};

async function checkRateLimit() {
	const headers = new Headers({
		Accept: 'application/vnd.github.v3+json',
		'User-Agent': 'nextjs-15-roll-your-own-authentication',
	});

	const token = process.env.GITHUB_TOKEN;
	if (token) {
		headers.append('Authorization', `Bearer ${token}`);
	}

	const response = await fetch(`${GITHUB_API_BASE}/rate_limit`, { headers });
	const data = await response.json();

	console.log('GitHub Rate Limit Status:', {
		remaining: data.rate.remaining,
		limit: data.rate.limit,
		resetAt: new Date(data.rate.reset * 1000).toLocaleString(),
		isRateLimited: data.rate.remaining === 0,
	});

	return data.rate;
}

/**
 * Get GitHub commits for the main repository
 * @returns Promise with commit data or empty array on error
 */
export const getGithubCommits = cache(async () => {
	try {
		const rateLimit = await checkRateLimit();
		console.log('\n=== GitHub API Debug Info ===');
		console.log('Rate Limit:', {
			remaining: rateLimit.remaining,
			limit: rateLimit.limit,
			resetAt: new Date(rateLimit.reset * 1000).toLocaleString(),
		});

		if (rateLimit.remaining === 0) {
			console.error(
				'GitHub API rate limit exceeded. Resets at:',
				new Date(rateLimit.reset * 1000).toLocaleString()
			);
			return [];
		}

		const headers = new Headers({
			Accept: 'application/vnd.github.v3+json',
			'User-Agent': 'architecture-ryoa',
		});

		const token = process.env.GITHUB_TOKEN;
		if (!token) {
			console.warn(
				'GITHUB_TOKEN not found in environment variables. Using public API with rate limits.'
			);
		} else {
			headers.append('Authorization', `Bearer ${token}`);
			console.log(
				'Using GitHub token:',
				token.substring(0, 4) + '...' + token.substring(token.length - 4)
			);
		}

		// First check if the repository exists
		console.log('\nChecking repository:', `${REPO_OWNER}/${REPO_NAME}`);
		const repoResponse = await fetch(`${GITHUB_API_BASE}/repos/${REPO_OWNER}/${REPO_NAME}`, {
			headers,
		});

		if (!repoResponse.ok) {
			const error = await repoResponse.json();
			console.error('Repository access error:', {
				status: repoResponse.status,
				statusText: repoResponse.statusText,
				error,
			});
			return [];
		}

		const repoData = await repoResponse.json();
		console.log('Repository info:', {
			name: repoData.name,
			fullName: repoData.full_name,
			defaultBranch: repoData.default_branch,
		});

		// Then fetch commits
		console.log('\nFetching commits...');
		const response = await fetch(
			`${GITHUB_API_BASE}/repos/${REPO_OWNER}/${REPO_NAME}/commits`,
			{
				headers,
				next: {
					revalidate: 300,
				},
			}
		);

		if (!response.ok) {
			const error = (await response.json()) as TGitHubError;
			console.error('Commits fetch error:', {
				status: response.status,
				statusText: response.statusText,
				error,
			});
			return [];
		}

		const data = await response.json();
		console.log('\nFetched commits:', {
			count: data.length,
			firstCommit: data[data.length - 1]?.commit?.message,
			lastCommit: data[0]?.commit?.message,
		});
		console.log('=== End Debug Info ===\n');

		return data;
	} catch (error) {
		console.error('Error fetching commits:', error);
		return [];
	}
});

/**
 * Utility function to get a commit count with error handling and caching
 * @returns Promise with commit count or fallback number
 */
export const getCommitCount = cache(async () => {
	try {
		const commits = await getGithubCommits();
		return commits.length || 0;
	} catch (error) {
		console.error('Error fetching commit count:', error);
		return 0; // Return 0 instead of fallback number for accuracy
	}
});
