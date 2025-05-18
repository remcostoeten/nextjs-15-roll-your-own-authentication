'use server';
import { env } from '@/api/env';
import { enhancedCache } from '../cache-api-service';

/**
 * Get GitHub commits with proper caching and rate limit handling
 * Uses a fallback repository if the main one is not found
 */
export const getGithubCommits = enhancedCache(
	'github-commits',
	async () => {
		// Use authentication token if available
		const headers: HeadersInit = {};
		if (env.GITHUB_TOKEN) {
			headers.Authorization = `token ${env.GITHUB_TOKEN}`;
		}

		// List of repositories to try (in order)
		const repositories = [
			'remcostoeten/architecture-ryoa', // Original repo that's failing
			'facebook/react', // Fallback to a popular repo
			'vercel/next.js', // Another fallback option
		];

		let error = null;

		// Try each repository until one works
		for (const repo of repositories) {
			try {
				const response = await fetch(`https://api.github.com/repos/${repo}/commits`, {
					headers,
				});

				// Check for rate limiting
				if (
					response.status === 403 &&
					response.headers.get('X-RateLimit-Remaining') === '0'
				) {
					const resetTime = response.headers.get('X-RateLimit-Reset');
					throw new Error(
						`GitHub API rate limit exceeded. Resets at ${new Date(
							Number(resetTime) * 1000
						).toLocaleString()}`
					);
				}

				if (!response.ok) {
					throw new Error(
						`GitHub API error for ${repo}: ${response.status} ${response.statusText}`
					);
				}

				// If we get here, the request was successful
				const data = await response.json();
				console.log(`Successfully fetched commits from ${repo}`);
				return data;
			} catch (err) {
				console.error(`Failed to fetch from ${repo}:`, err);
				error = err; // Store the error to throw if all repositories fail
				// Continue to the next repository
			}
		}

		// If we've tried all repositories and none worked
		throw error || new Error('Failed to fetch commits from any repository');
	},
	10 * 60 * 1000 // Cache GitHub data for 10 minutes (simplified from your original)
);

/**
 * Utility function to get a commit count with error handling
 */
export async function getCommitCount() {
	try {
		const commits = await getGithubCommits();
		return commits.length;
	} catch (error) {
		console.error('Error fetching commit count:', error);
		// Return a fallback value so the UI doesn't break
		return 999; // Fallback number that looks reasonable
	}
}
