import type { ChangelogEntry, ChangelogGroup } from "../types/changelog"

export const changelogEntries: ChangelogEntry[] = [
  {
    id: "cl-001",
    title: "Initial release of Roll Your Own Auth",
    date: "2024-03-10T00:00:00Z",
    description:
      "First public release of the Roll Your Own Auth framework, featuring email/password authentication, session management, and basic user management.",
    categories: ["feature"],
    version: "1.0.0",
    author: "remcostoeten",
    githubUrl: "https://github.com/remcostoeten/nextjs-15-roll-your-own-authentication/commit/initial-release",
    votes: 12,
  },
  {
    id: "cl-002",
    title: "Added JWT token implementation",
    date: "2024-03-12T00:00:00Z",
    description:
      "Implemented JWT token authentication with zero dependencies. Uses the native Web Crypto API for token signing and verification.",
    categories: ["feature"],
    version: "1.1.0",
    author: "remcostoeten",
    githubUrl: "https://github.com/remcostoeten/nextjs-15-roll-your-own-authentication/commit/jwt-implementation",
    votes: 18,
  },
  {
    id: "cl-003",
    title: "Fixed session expiration bug",
    date: "2024-03-15T00:00:00Z",
    description: "Fixed an issue where sessions weren't properly expiring after the configured timeout period.",
    categories: ["bugfix", "security"],
    version: "1.1.1",
    author: "remcostoeten",
    githubUrl: "https://github.com/remcostoeten/nextjs-15-roll-your-own-authentication/commit/session-expiration-fix",
    votes: 5,
  },
  {
    id: "cl-004",
    title: "Improved password hashing performance",
    date: "2024-03-18T00:00:00Z",
    description: "Optimized the password hashing algorithm to reduce CPU usage while maintaining security standards.",
    categories: ["performance", "security"],
    version: "1.1.2",
    author: "remcostoeten",
    githubUrl: "https://github.com/remcostoeten/nextjs-15-roll-your-own-authentication/commit/password-hashing-perf",
    votes: 7,
  },
  {
    id: "cl-005",
    title: "Added OAuth2 provider support",
    date: "2024-03-25T00:00:00Z",
    description:
      "Implemented OAuth2 authentication flow for GitHub, Google, and Discord providers without external dependencies.",
    categories: ["feature"],
    version: "1.2.0",
    author: "remcostoeten",
    githubUrl: "https://github.com/remcostoeten/nextjs-15-roll-your-own-authentication/commit/oauth2-providers",
    votes: 25,
  },
  {
    id: "cl-006",
    title: "Comprehensive documentation update",
    date: "2024-03-28T00:00:00Z",
    description:
      "Added detailed documentation for all authentication methods, including code examples and security best practices.",
    categories: ["documentation", "improvement"],
    version: "1.2.1",
    author: "remcostoeten",
    githubUrl: "https://github.com/remcostoeten/nextjs-15-roll-your-own-authentication/commit/docs-update",
    votes: 9,
  },
  {
    id: "cl-007",
    title: "Role-based access control implementation",
    date: "2024-04-05T00:00:00Z",
    description: "Added a comprehensive RBAC system for managing user permissions and access control.",
    categories: ["feature"],
    version: "1.3.0",
    author: "remcostoeten",
    githubUrl: "https://github.com/remcostoeten/nextjs-15-roll-your-own-authentication/commit/rbac-implementation",
    votes: 15,
  },
  {
    id: "cl-008",
    title: "Database schema optimization",
    date: "2024-04-10T00:00:00Z",
    description: "Optimized database schema for better performance and reduced query times.",
    categories: ["performance", "improvement"],
    version: "1.3.1",
    author: "remcostoeten",
    githubUrl: "https://github.com/remcostoeten/nextjs-15-roll-your-own-authentication/commit/db-optimization",
    votes: 6,
  },
  {
    id: "cl-009",
    title: "Two-factor authentication support",
    date: "2024-04-15T00:00:00Z",
    description: "Added support for TOTP-based two-factor authentication using the Web Crypto API.",
    categories: ["feature", "security"],
    version: "1.4.0",
    author: "remcostoeten",
    githubUrl: "https://github.com/remcostoeten/nextjs-15-roll-your-own-authentication/commit/2fa-support",
    votes: 21,
  },
  {
    id: "cl-010",
    title: "Breaking change: Updated token format",
    date: "2024-04-20T00:00:00Z",
    description:
      "Changed the JWT token format to include additional security claims. This is a breaking change that requires updating client implementations.",
    categories: ["breaking", "security", "improvement"],
    version: "2.0.0",
    author: "remcostoeten",
    githubUrl: "https://github.com/remcostoeten/nextjs-15-roll-your-own-authentication/commit/token-format-update",
    votes: 11,
  },
]

// Helper function to group changelog entries by month and year
export function groupChangelogEntriesByMonth(entries: ChangelogEntry[]): ChangelogGroup[] {
  const sortedEntries = [...entries].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  const groups: Record<string, ChangelogGroup> = {}

  sortedEntries.forEach((entry) => {
    const date = new Date(entry.date)
    const month = date.toLocaleString("default", { month: "long" })
    const year = date.getFullYear().toString()
    const key = `${year}-${month}`

    if (!groups[key]) {
      groups[key] = {
        month,
        year,
        entries: [],
      }
    }

    groups[key].entries.push(entry)
  })

  return Object.values(groups)
}

