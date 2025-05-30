'use server';

import { siteConfig } from '@/core/config/site-config';
import { octokit } from '@/core/lib/octokit';
import { cache } from 'react';
import { fallbackCommits } from './fallback-data';

const CACHE_TTL_MS = 5 * 60 * 1000;

export async function fetchCommitData() {
	try {
		const { data: commits } = await octokit.rest.repos.listCommits({
			owner: siteConfig.github.owner,
			repo: siteConfig.github.repo,
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
		return fallbackCommits;
	}
}

export const getCachedCommitData = cache(fetchCommitData);

export async function getCommitDataClient() {
	try {
		const data = await getCachedCommitData();
		return data;
	} catch (error) {
		console.error('Error in client commit data:', error);
		return fallbackCommits;
	}
}
