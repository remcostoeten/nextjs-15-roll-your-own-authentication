'use client';

import { getGithubCommits } from '@/api/queries/get-github-commits';
import { AnimatedContent, AnimatedText } from '@/shared/components/effects/animated-content';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/components/ui/popover';
import { Skeleton } from '@/shared/components/ui/skeleton';
import NumberFlow from '@number-flow/react';
import { GitCommit } from 'lucide-react';
import { Suspense, useEffect, useState } from 'react';

type TGitHubCommit = {
  commit: {
    message: string;
    author: {
      name: string;
      date: string;
    };
  };
  author: {
    login: string;
  };
};

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

function CommitPopover({ commit }: { commit: TGitHubCommit }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-sm font-medium">
        <GitCommit className="h-4 w-4" />
        Latest Commit
      </div>
      <div className="text-xs text-muted-foreground">
        <p className="font-medium text-foreground">{commit.commit.message}</p>
        <p className="mt-1">by {commit.commit.author?.name || 'Unknown'}</p>
        <p>{formatDate(new Date(commit.commit.author?.date))}</p>
      </div>
    </div>
  );
}

export function GitHubStats() {
  const [commits, setCommits] = useState<TGitHubCommit[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCommits = async () => {
      try {
        const commitData = await getGithubCommits();
        setCommits(commitData || []);
      } catch (error) {
        console.error('Error fetching commits:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCommits();
  }, []);

  return (
    <div className="border-t border-gray-800 py-12 transition-all duration-300 hover:bg-gray-900/30">
      <AnimatedContent className="flex flex-col items-center justify-center space-y-3 relative" delay={0.6}>
        <AnimatedText className="text-sm font-medium uppercase tracking-wider text-gray-500 text-center w-full px-4" delay={0.7}>
          architecture ● ryoa {loading && '(Loading...)'}
        </AnimatedText>

        <div className="flex items-baseline justify-center w-full">
          <div className="flex items-baseline">
            <Suspense fallback={<Skeleton className="h-24 w-32" />}>
              {loading ? (
                <Skeleton className="h-24 w-32" />
              ) : (
                <Popover>
                  <PopoverTrigger asChild>
                    <div className="text-7xl font-bold text-white relative cursor-pointer group">
                      <NumberFlow
                        value={commits.length}
                        transformTiming={{ duration: 1000 }}
                        spinTiming={{ duration: 1000 }}
                        opacityTiming={{ duration: 1000 }}
                        format={{ notation: 'standard' }}
                        willChange={true}
                      />
                      <div className="absolute -right-2 -top-2 h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
                    </div>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-80 p-4 bg-card/80 backdrop-blur-sm border border-border/50"
                    sideOffset={5}
                  >
                    {commits[0] ? (
                      <>
                        <CommitPopover commit={commits[0]} />
                        <div className="mt-2 pt-2 border-t border-border/50 text-xs text-muted-foreground">
                          Check console for rate limit info
                        </div>
                      </>
                    ) : (
                      <div className="text-sm text-muted-foreground">
                        No commits found. Check console for rate limit info.
                      </div>
                    )}
                  </PopoverContent>
                </Popover>
              )}
            </Suspense>
            <AnimatedText className="ml-3 text-xl font-medium text-gray-400">
              Commits
            </AnimatedText>
          </div>
        </div>
      </AnimatedContent>
    </div>
  );
}
