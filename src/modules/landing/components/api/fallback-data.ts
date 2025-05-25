// Fallback data for when GitHub API is rate limited
export const fallbackCommitData = [
	{ date: '2023-11', commits: 12 },
	{ date: '2023-12', commits: 15 },
	{ date: '2024-01', commits: 18 },
	{ date: '2024-02', commits: 21 },
	{ date: '2024-03', commits: 15 },
	{ date: '2024-04', commits: 25 }, // Latest month shows higher activity
];

export const fallbackRepoStats = {
	stars: 8,
	forks: 3,
	pullRequests: 5,
	branch: 'main',
};

// Total commits should sum to around 81 to match the repository
export const fallbackCommits = [
	{
		commit: {
			message: 'Initial commit: Project setup with Next.js and authentication',
			author: {
				name: 'remcostoeten',
				date: '2023-11-01T00:00:00Z',
			},
		},
		author: {
			login: 'remcostoeten',
			avatar_url: 'https://github.com/remcostoeten.png',
		},
	},
	{
		commit: {
			message: 'Add RYOA (Roll Your Own Auth) implementation',
			author: {
				name: 'remcostoeten',
				date: '2024-01-15T00:00:00Z',
			},
		},
		author: {
			login: 'remcostoeten',
			avatar_url: 'https://github.com/remcostoeten.png',
		},
	},
	{
		commit: {
			message: 'Implement GitHub OAuth integration',
			author: {
				name: 'remcostoeten',
				date: '2024-02-01T00:00:00Z',
			},
		},
		author: {
			login: 'remcostoeten',
			avatar_url: 'https://github.com/remcostoeten.png',
		},
	},
	{
		commit: {
			message: 'Add shell for v2...',
			author: {
				name: 'remcostoeten',
				date: '2024-04-14T00:01:00Z',
			},
		},
		author: {
			login: 'remcostoeten',
			avatar_url: 'https://github.com/remcostoeten.png',
		},
	},
];
