export async function fetchActivities(page: number) {
    const [commitsRes, deploymentsRes, releasesRes] = await Promise.all([
      fetch(`https://api.github.com/repos/remcostoeten/nextjs-15-roll-your-own-authentication/commits?page=${page}&per_page=10`),
      fetch(`https://api.github.com/repos/remcostoeten/nextjs-15-roll-your-own-authentication/deployments?page=${page}&per_page=10`),
      fetch(`https://api.github.com/repos/remcostoeten/nextjs-15-roll-your-own-authentication/releases?page=${page}&per_page=10`)
    ])
  
    if (!commitsRes.ok || !deploymentsRes.ok || !releasesRes.ok) {
      throw new Error('Failed to fetch repository data')
    }
  
    const [commits, deployments, releases] = await Promise.all([
      commitsRes.json(),
      deploymentsRes.json(),
      releasesRes.json()
    ])
  
    const enrichedCommits = await Promise.all(commits.map(async (commit: any) => {
      const detailedCommitRes = await fetch(commit.url)
      const detailedCommit = await detailedCommitRes.json()
      return {
        ...commit,
        type: 'commit',
        status: commit.commit.verification?.verified ? 'verified' : 'unverified',
        environment: commit.commit.message.toLowerCase().includes('production') ? 'production' : 'development',
        impact: detailedCommit.stats.total > 100 ? 'major' : 'minor',
        files: detailedCommit.files
      }
    }))
  
    const enrichedDeployments = deployments.map((deployment: any) => ({
      ...deployment,
      type: 'deployment',
      status: deployment.state,
      environment: deployment.environment,
      impact: 'major'
    }))
  
    const enrichedReleases = releases.map((release: any) => ({
      ...release,
      type: 'release',
      status: 'verified',
      environment: 'production',
      impact: 'major'
    }))
  
    return [...enrichedCommits, ...enrichedDeployments, ...enrichedReleases].sort((a, b) => 
      new Date(b.commit?.author?.date || b.created_at).getTime() - 
      new Date(a.commit?.author?.date || a.created_at).getTime()
    )
  }
  
  