import { getGithubCommits } from '@/api/queries/get-github-commits';
import { AnimatedNumbers } from '@/modules/landing/components/a';
import { FeaturesClient } from '@/modules/landing/components/features';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { Suspense } from 'react';

export default async function Page() {
  const commits = await getGithubCommits(); // SSR prefetch
  const commitCount = commits?.length ?? 0;
  const repoName = 'ryoa/repo-name'; // Replace with actual repo name or fetch if needed

  return (
    <main>
      <FeaturesClient commitCount={0} />


    </main>
  );
}
