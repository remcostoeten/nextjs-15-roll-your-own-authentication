export async function getChangelogEntryVotes(entryId: string): Promise<number> {
	// Return a mock vote count
	return 5
}

/**
 * Get votes for all changelog entries
 */
export async function getAllChangelogVotes(): Promise<Record<string, number>> {
	// Return mock data
	return {
		'cl-001': 12,
		'cl-002': 18,
		'cl-003': 5,
	}
}

/**
 * Get top voted changelog entries
 */
export async function getTopVotedChangelogEntries(
	limit = 5
): Promise<Array<{ id: string; title: string; votes: number }>> {
	// Return mock data
	return [
		{ id: 'cl-002', title: 'Added JWT token implementation', votes: 18 },
		{ id: 'cl-005', title: 'Added OAuth2 provider support', votes: 25 },
		{ id: 'cl-009', title: 'Two-factor authentication support', votes: 21 },
	]
}

/**
 * Get voter geolocation data for a specific entry (admin only)
 */
export async function getChangelogEntryVoterData(entryId: string, isAdmin: boolean): Promise<any[] | null> {
	// Only admins can access this data
	if (!isAdmin) {
		return null
	}

	// Return mock data
	return [
		{
			id: 'vote-1',
			ip: '192.168.1.1',
			userAgent: 'Mozilla/5.0',
			country: 'United States',
			city: 'New York',
			region: 'NY',
			timestamp: new Date().toISOString(),
			active: true,
		},
	]
}
