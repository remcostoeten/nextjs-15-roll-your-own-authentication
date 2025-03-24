"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { fetchRepoData, type RepoData, type LanguageData, type ContributorData, type BranchData } from "../api/queries"

interface GitHubRepoCardProps {
  repoName?: string
}

export function GitHubRepoCard({
  repoName = "remcostoeten/nextjs-15-roll-your-own-authentication",
}: GitHubRepoCardProps) {
  const [repoData, setRepoData] = useState<RepoData | null>(null)
  const [languages, setLanguages] = useState<LanguageData | null>(null)
  const [contributors, setContributors] = useState<ContributorData[] | null>(null)
  const [branches, setBranches] = useState<BranchData[] | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [dataSource, setDataSource] = useState<"api" | "fallback" | null>(null)
  const [latestCommit, setLatestCommit] = useState<string | null>(null)

  useEffect(() => {
    async function loadRepoData() {
      try {
        setIsLoading(true)
        const data = await fetchRepoData(repoName)

        setRepoData(data.repo)
        setLanguages(data.languages)
        setContributors(data.contributors)
        setBranches(data.branches)
        setDataSource(data.source as "api" | "fallback")

        // Fetch latest commit message
        const commitsResponse = await fetch(`https://api.github.com/repos/${repoName}/commits?per_page=1`, {
          headers: {
            Accept: "application/vnd.github.v3+json",
          },
        })

        if (commitsResponse.ok) {
          const commits = await commitsResponse.json()
          if (commits && commits.length > 0) {
            setLatestCommit(commits[0].commit.message)
          }
        }
      } catch (error) {
        console.error("Error loading repo data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadRepoData()
  }, [repoName])

  // Format date to a more readable format
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    } catch (e) {
      return dateString
    }
  }

  if (isLoading) {
    return (
      <div className="animate-pulse bg-[#0D0C0C] border border-[#1E1E1E] rounded p-4 w-full max-w-md">
        <div className="h-6 bg-gray-700 rounded w-3/4 mb-4"></div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-700 rounded w-1/2"></div>
          <div className="h-4 bg-gray-700 rounded w-1/3"></div>
          <div className="h-4 bg-gray-700 rounded w-2/3"></div>
        </div>
      </div>
    )
  }

  if (!repoData) {
    return <div className="text-red-500">Failed to load repository data</div>
  }

  // Get the repository name from the full name
  const displayName = repoData.name.replace(/-/g, "-").toUpperCase()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-[#0D0C0C] border border-[#1E1E1E] rounded p-4 w-full max-w-md text-sm"
    >
      <div className="flex items-center gap-2 mb-3">
        <svg
          className="w-5 h-5 text-[#4e9815]"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
          <path d="M9 18c-4.51 2-5-2-7-2" />
        </svg>
        <h2 className="font-bold text-white">{displayName}</h2>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-3 text-xs text-[#8C877D]">
        <div className="flex items-center gap-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-4 h-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
            <line x1="16" x2="16" y1="2" y2="6" />
            <line x1="8" x2="8" y1="2" y2="6" />
            <line x1="3" x2="21" y1="10" y2="10" />
          </svg>
          <span>Created: {formatDate(repoData.created_at)}</span>
        </div>
        <div className="flex items-center gap-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-4 h-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 20.94c1.5 0 2.75 1.06 4 1.06 3 0 6-8 6-12.22A4.91 4.91 0 0 0 17 5c-2.22 0-4 1.44-5 2-1-.56-2.78-2-5-2a4.9 4.9 0 0 0-5 4.78C2 14 5 22 8 22c1.25 0 2.5-1.06 4-1.06Z" />
            <path d="M10 2c1 .5 2 2 2 5" />
          </svg>
          <span>Commits: {contributors?.[0]?.contributions || 20}</span>
        </div>

        <div className="flex items-center gap-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-4 h-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 17.8 5.8 21 7 14.1 2 9.3l7-1L12 2l3 6.3 7 1-5 4.8 1.2 6.9-6.2-3.2Z" />
          </svg>
          <span>Stars: {repoData.stargazers_count}</span>
        </div>
        <div className="flex items-center gap-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-4 h-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M7 7H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h3" />
            <path d="M7 7v10" />
            <path d="M20 7h3a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-3" />
            <path d="M20 7v10" />
            <path d="M8 7h8" />
            <path d="M8 17h8" />
            <path d="M7 12h13" />
          </svg>
          <span>Forks: {repoData.forks_count}</span>
        </div>

        <div className="flex items-center gap-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-4 h-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M6 3v12" />
            <circle cx="18" cy="6" r="3" />
            <circle cx="6" cy="18" r="3" />
            <path d="M18 9a9 9 0 0 1-9 9" />
          </svg>
          <span>Branches: {branches?.length || 1}</span>
        </div>
        <div className="flex items-center gap-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-4 h-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
          <span>Contributors: {contributors?.length || 1}</span>
        </div>
      </div>

      {/* Language bars */}
      {languages && Object.entries(languages).length > 0 && (
        <div className="mb-3">
          {Object.entries(languages).map(([language, percentage], index) => (
            <div key={language} className="mb-1">
              <div className="flex justify-between text-xs mb-1">
                <span
                  className={`${language === "TypeScript" ? "text-blue-400" : language === "Shell" ? "text-green-400" : "text-yellow-400"}`}
                >
                  {language}
                </span>
                <span className="text-[#8C877D]">{percentage}%</span>
              </div>
              <div className="w-full bg-[#1E1E1E] rounded-full h-1.5">
                <div
                  className={`h-1.5 rounded-full ${
                    language === "TypeScript" ? "bg-blue-400" : language === "Shell" ? "bg-green-400" : "bg-yellow-400"
                  }`}
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      )}

      <a
        href={repoData.html_url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-[#4e9815] hover:underline text-xs inline-block mb-3"
      >
        View on GitHub
      </a>

      <div className="text-xs text-[#8C877D] border-t border-[#1E1E1E] pt-2">
        <div className="flex items-center gap-1">
          <span>git:</span>
          <span className="text-[#4e9815]">({repoData.default_branch})</span>
          <span>&gt;{repoData.full_name.split("/")[1]}</span>
        </div>
        {latestCommit && (
          <div className="mt-1">
            <span>$ Latest commit: </span>
            <span className="text-[#4e9815]">
              {latestCommit.length > 40 ? latestCommit.substring(0, 40) + "..." : latestCommit}
            </span>
          </div>
        )}
      </div>

      <div className="flex gap-2 mt-3">
        <button className="bg-white text-black px-4 py-2 rounded text-xs font-medium">GET STARTED</button>
        <button className="border border-[#1E1E1E] text-white px-4 py-2 rounded text-xs font-medium flex items-center gap-1">
          <span>+</span> Create Sign in Box
        </button>
      </div>

      {dataSource === "fallback" && (
        <p className="mt-2 text-[10px] text-[#8C877D] italic">Using sample data (GitHub API unavailable)</p>
      )}
    </motion.div>
  )
}

