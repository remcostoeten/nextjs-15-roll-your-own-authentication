import { IGitHubCommit, IGitHubRepository, GitHubLanguages } from "../../types";
import { getCache, setCache } from "../services/cache-github-service";

const GITHUB_API_URL = "https://api.github.com";
const REPO_OWNER = "remcostoeten";
const REPO_NAME = "nextjs-15-roll-your-own-authentication";

async function fetchWithCache<T>(url: string, options?: RequestInit): Promise<T> {
  const cacheKey = url + JSON.stringify(options || {});
  const cached = getCache<T>(cacheKey);
  if (cached) return cached;

  try {
    const response = await fetch(url, {
      headers: {
        Accept: "application/vnd.github.v3+json",
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`GitHub API Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    setCache<T>(cacheKey, data);
    return data;
  } catch (err) {
    console.error("Error fetching GitHub data:", err);
    throw err;
  }
}

export async function getRepositoryInfo(): Promise<IGitHubRepository> {
  return fetchWithCache<IGitHubRepository>(
    `${GITHUB_API_URL}/repos/${REPO_OWNER}/${REPO_NAME}`
  );
}

export async function getRepositoryCommits(count = 5): Promise<IGitHubCommit[]> {
  return fetchWithCache<IGitHubCommit[]>(
    `${GITHUB_API_URL}/repos/${REPO_OWNER}/${REPO_NAME}/commits?per_page=${count}`
  );
}

export async function getRepositoryLanguages(): Promise<GitHubLanguages> {
  return fetchWithCache<GitHubLanguages>(
    `${GITHUB_API_URL}/repos/${REPO_OWNER}/${REPO_NAME}/languages`
  );
}

