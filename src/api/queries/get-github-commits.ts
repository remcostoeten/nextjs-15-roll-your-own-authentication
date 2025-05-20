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
		const token = process.env.GITHUB_TOKEN;
		if (!token) {
			console.warn('GITHUB_TOKEN not found in environment variables. Using public API with rate limits.');
		} else {
			headers.append('Authorization', `Bearer ${token}`);
		}

		// First check if the repository exists
		const repoResponse = await fetch(
			`${GITHUB_API_BASE}/repos/${REPO_OWNER}/${REPO_NAME}`,
			{ headers }
		);

		if (!repoResponse.ok) {
			console.error('Repository not found or API error');
			return [];
		}

		// Then fetch commits
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
			console.error('GitHub API error:', error.message);
			return [];
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
		return commits.length || 0;
	} catch (error) {
		console.error('Error fetching commit count:', error);
		return 0; // Return 0 instead of fallback number for accuracy
	}
});
