'use server';

import { octokit } from '@/core/lib/octokit'; // Assuming you have Octokit setup
import { cache } from 'react';
import { fallbackCommitData } from './fallback-data';

const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

export async function fetchCommitData() {
	try {
		const { data: commits } = await octokit.rest.repos.listCommits({
			owner: 'remcostoeten',
			repo: 'architecture-ryoa',
			per_page: 100,
		});

		return commits.map((commit) => ({
			commit: {
				message: commit.commit.message,
				author: {
					name: commit.commit.author?.name || 'Unknown',
					date: commit.commit.author?.date || new Date().toISOString(),
				},
			},
			author: {
				login: commit.author?.login || 'Unknown',
			},
		}));
	} catch (error) {
		console.error('Error fetching commit data:', error);
		return fallbackCommitData;
	}
}

// Cached version using React cache
export const getCachedCommitData = cache(fetchCommitData);

// Client-side fetch wrapper
export async function getCommitDataClient() {
	try {
		const data = await getCachedCommitData();
		return data;
	} catch (error) {
		console.error('Error in client commit data:', error);
		return fallbackCommitData;
	}
}
