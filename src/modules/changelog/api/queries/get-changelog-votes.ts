// Mock votes data for demo purposes
const mockVotesData: Record<string, number> = {
	'cl-001': 12,
	'cl-002': 18,
	'cl-003': 5,
	'cl-004': 7,
	'cl-005': 25,
	'cl-006': 9,
	'cl-007': 15,
	'cl-008': 6,
	'cl-009': 21,
	'cl-010': 11,
}

// Mock voter data for admin view
const mockVoterData: Record<string, any[]> = {
	'cl-001': [
		{
			id: 'v1',
			ip: '192.168.1.1',
			country: 'United States',
			city: 'New York',
			timestamp: new Date().toISOString(),
			active: true,
		},
		{
			id: 'v2',
			ip: '192.168.1.2',
			country: 'Canada',
			city: 'Toronto',
			timestamp: new Date().toISOString(),
			active: true,
		},
	],
	'cl-002': [
		{
			id: 'v3',
			ip: '192.168.1.3',
			country: 'United Kingdom',
			city: 'London',
			timestamp: new Date().toISOString(),
			active: true,
		},
	],
}

/**
 * Get votes for a specific changelog entry
 *
 * @param entryId The ID of the changelog entry
 * @returns The number of active votes for the entry
 */
export async function getChangelogEntryVotes(entryId: string): Promise<number> {
	// In a real app, this would query the database
	// For demo purposes, return mock data or 0 if not found
	return mockVotesData[entryId] || 0
}

/**
 * Get top voted changelog entries
 *
 * @param limit The maximum number of entries to return
 * @returns An array of top voted entries with their IDs, titles, and vote counts
 */
export async function getTopVotedChangelogEntries(
	limit = 5
): Promise<Array<{ id: string; title: string; votes: number }>> {
	// Mock implementation
	const entries = [
		{ id: 'cl-005', title: 'Added OAuth2 provider support', votes: 25 },
		{ id: 'cl-009', title: 'Two-factor authentication support', votes: 21 },
		{ id: 'cl-002', title: 'Added JWT token implementation', votes: 18 },
		{
			id: 'cl-007',
			title: 'Role-based access control implementation',
			votes: 15,
		},
		{
			id: 'cl-001',
			title: 'Initial release of Roll Your Own Auth',
			votes: 12,
		},
	].slice(0, limit)

	return entries
}

/**
 * Get voter geolocation data for a specific entry (admin only)
 *
 * @param entryId The ID of the changelog entry
 * @param isAdmin Whether the requester is an admin
 * @returns An array of voter data or null if not admin
 */
export async function getChangelogEntryVoterData(
	entryId: string,
	isAdmin: boolean
): Promise<any[] | null> {
	// Only admins can access this data
	if (!isAdmin) {
		return null
	}

	// In a real app, this would query the database
	// For demo purposes, return mock data or empty array if not found
	return mockVoterData[entryId] || []
}
