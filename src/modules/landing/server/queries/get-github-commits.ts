'use server';

import { fetchCommitData } from '@/modules/landing/components/api/cache-services';
import { fallbackCommitData } from '@/modules/landing/components/api/fallback-data';

/**
 * Retrieves commit data from GitHub, returning fallback data if the fetch fails.
 *
 * @returns An array of commit data objects, either from GitHub or a predefined fallback.
 */
export async function getGitHubCommits() {
	try {
		const data = await fetchCommitData();
		return data;
	} catch (error) {
		console.error('Error fetching GitHub commits:', error);
		return fallbackCommitData;
	}
}
