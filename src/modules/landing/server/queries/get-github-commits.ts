'use server';

import { fetchCommitData } from '@/modules/landing/components/api/cache-services';
import { fallbackCommitData } from '@/modules/landing/components/api/fallback-data';

export async function getGitHubCommits() {
  try {
    const data = await fetchCommitData();
    return data;
  } catch (error) {
    console.error('Error fetching GitHub commits:', error);
    return fallbackCommitData;
  }
}