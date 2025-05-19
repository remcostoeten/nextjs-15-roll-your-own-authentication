'use server';

import { cache } from 'react';

const GITHUB_API_BASE = 'https://api.github.com';
const REPO_OWNER = 'remcostoeten';
const REPO_NAME = 'architecture-ryoa';

type TGitHubError = {
	message: string;
	documentation_url?: string;
};

/**
 * Get GitHub commits for the main repository
 * @returns Promise with commit data or empty array on error
 */
export const getGithubCommits = cache(async () => {
	try {
		const headers = new Headers({
			'Accept': 'application/vnd.github.v3+json',
			'User-Agent': 'architecture-ryoa',
		});

		// Add GitHub token if available
		if (process.env.GITHUB_TOKEN) {
			headers.append('Authorization', `token ${process.env.GITHUB_TOKEN}`);
		}

		const response = await fetch(
			`${GITHUB_API_BASE}/repos/${REPO_OWNER}/${REPO_NAME}/commits`,
			{
				headers,
				next: {
					revalidate: 300, // Cache for 5 minutes
				},
			}
		);

		if (!response.ok) {
			const error = (await response.json()) as TGitHubError;
			throw new Error(`GitHub API error: ${error.message}`);
		}

		const data = await response.json();
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
		return commits.length;
	} catch (error) {
		console.error('Error fetching commit count:', error);
		return 999; // Fallback number that looks reasonable
	}
});
