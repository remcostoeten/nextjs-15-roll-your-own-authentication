'use client';

import { getGithubCommits } from '@/api/queries/get-github-commits';
import { Waves } from '@/components/effects/waves';
import { AnimatedContent, AnimatedText } from '@/shared/components/effects/animated-content';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/components/ui/popover';
import { Skeleton } from '@/shared/components/ui/skeleton';
import NumberFlow from '@number-flow/react';
import { GitCommit, GitFork, GitPullRequest, Star, TreePalmIcon } from 'lucide-react';
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

type TRepoStats = {
  stars: number;
  forks: number;
  pullRequests: number;
  branch: string;
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

function RepoStats({ stats }: { stats: TRepoStats }) {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium">Repository Statistics</h3>
      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center gap-2">
          <Star className="h-4 w-4 text-yellow-500" />
          <span className="text-sm">{stats.stars} Stars</span>
        </div>
        <div className="flex items-center gap-2">
          <GitFork className="h-4 w-4 text-blue-500" />
          <span className="text-sm">{stats.forks} Forks</span>
        </div>
        <div className="flex items-center gap-2">
          <GitPullRequest className="h-4 w-4 text-green-500" />
          <span className="text-sm">{stats.pullRequests} PRs</span>
        </div>
        <div className="flex items-center gap-2">
          <TreePalmIcon className="h-4 w-4 text-purple-500" />
          <span className="text-sm">{stats.branch}</span>
        </div>
      </div>
    </div>
  );
}

export function GitHubStats() {
  const [commits, setCommits] = useState<TGitHubCommit[]>([]);
  const [loading, setLoading] = useState(true);
  const [repoStats, setRepoStats] = useState<TRepoStats>({
    stars: 0,
    forks: 0,
    pullRequests: 0,
    branch: 'main'
  });

  useEffect(() => {
    const fetchCommits = async () => {
      try {
        const commitData = await getGithubCommits();
        // Make sure we have at least some commits to display even if API fails
        const commits = commitData?.length ? commitData : [
          {
            commit: {
              message: "Initial commit",
              author: {
                name: "Developer",
                date: new Date().toISOString()
              }
            },
            author: {
              login: "dev"
            }
          }
        ];

        setCommits(commits);

        // Mock data for now - you can replace with actual API calls
        setRepoStats({
          stars: 42,
          forks: 13,
          pullRequests: 7,
          branch: 'main'
        });
      } catch (error) {
        console.error('Error fetching commits:', error);
        // Set default data if API fails
        setCommits([
          {
            commit: {
              message: "Initial commit",
              author: {
                name: "Developer",
                date: new Date().toISOString()
              }
            },
            author: {
              login: "dev"
            }
          }
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchCommits();
  }, []);

  const latestCommit = commits[0];

  return (
    <div className="overflow-hidden relative border-t border-border/10 py-12 transition-all duration-300 hover:bg-accent/5">
      <AnimatedContent className="container mx-auto max-w-4xl relative" delay={0.6}>
    <Waves className='opacity-50 scale-150' />
<div className="flex flex-col items-center justify-center mb-8">
          <AnimatedText
            className="text-sm font-medium uppercase tracking-wider text-muted-foreground text-center"
            delay={0.7}
          >
            architecture ● ryoa {loading && '(Loading...)'}
          </AnimatedText>
        </div>

        {/* Main Stats */}
        <div className="flex flex-col items-center justify-center">
          <div className="flex items-baseline justify-center gap-3">
            <Suspense fallback={<Skeleton className="h-24 w-32" />}>
              {loading ? (
                <Skeleton className="h-24 w-32" />
              ) : (
                <Popover>
                  <PopoverTrigger asChild>
                    <div className="relative group">
                      <div className="text-7xl font-bold relative cursor-pointer bg-gradient-to-b from-foreground to-muted-foreground bg-clip-text ">
                        {commits.length > 0 ? (
                          <NumberFlow
                            value={commits.length}
                            transformTiming={{ duration: 1000 }}
                            spinTiming={{ duration: 1000 }}
                            opacityTiming={{ duration: 1000 }}
                            format={{ notation: 'standard' }}
                            willChange={true}
                          />
                        ) : (
                          <span>0</span>
                        )}
                      </div>
                      <div className="absolute -right-2 -top-2 h-2 w-2 rounded-full bg-primary animate-pulse" />
                      <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/10 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity blur-xl" />
                    </div>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-80 p-6 bg-popover/80 backdrop-blur-xl border border-border/50 shadow-xl shadow-primary/5"
                    sideOffset={5}
                  >
                    <div className="space-y-4">
                      <RepoStats stats={repoStats} />
                      {latestCommit && (
                        <>
                          <div className="border-t border-border/50 pt-4">
                            <CommitPopover commit={latestCommit} />
                          </div>
                          <div className="pt-2 text-xs text-muted-foreground">
                            Check console for rate limit info
                          </div>
                        </>
                      )}
                    </div>
                  </PopoverContent>
                </Popover>
              )}
            </Suspense>
            <AnimatedText className="text-xl font-medium text-muted-foreground">
              Commits
            </AnimatedText>
          </div>
        </div>

        {/* Commit info footer */}
        <div className="mt-8 flex justify-center">
          {latestCommit ? (
            <div className="flex items-center justify-between w-full max-w-2xl px-4 py-2 rounded-lg border border-border/20 bg-background/50 backdrop-blur-sm">
              <div className="flex items-center gap-2">
                <GitCommit className="h-4 w-4 text-primary" />
                <span className="text-sm text-muted-foreground hidden md:inline">{latestCommit.commit.message.slice(0, 50)}...</span>
                <span className="text-xs text-muted-foreground/60">{formatDate(new Date(latestCommit.commit.author.date))}</span>
              </div>
              <div className="flex items-center gap-2 text-primary">
                <TreePalmIcon className="h-4 w-4" />
                <span className="text-sm">{repoStats.branch}</span>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between w-full max-w-2xl px-4 py-2 rounded-lg border border-border/20 bg-background/50 backdrop-blur-sm">
              <div className="flex items-center gap-2">
                <GitCommit className="h-4 w-4 text-primary" />
                <span className="text-sm text-muted-foreground">No commits yet</span>
              </div>
              <div className="flex items-center gap-2 text-primary">
                <TreePalmIcon className="h-4 w-4" />
                <span className="text-sm">{repoStats.branch}</span>
              </div>
            </div>
          )}
        </div>
      </AnimatedContent>
    </div>
  );
}
