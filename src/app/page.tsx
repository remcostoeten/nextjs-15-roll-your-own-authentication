import EnvDisplay from '@/api/env/env-display'
import GitHubRepository from '@/modules/homepage/components/github-repository'

export default function Home() {
  return      <>  <GitHubRepository />
  <EnvDisplay />
  </>

}