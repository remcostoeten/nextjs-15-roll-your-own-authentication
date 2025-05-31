'use client';

import { getGithubCommits } from '@/api/queries/get-github-commits';
import { Waves } from '@/components/effects/waves';
import { GitCommit, GitFork, GitPullRequest, Star, TreePalmIcon } from 'lucide-react';
import { memo, useEffect, useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger, Skeleton } from 'ui';

// --- Type Definitions ---
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

// --- Constants ---
const fallbackCommit: TGitHubCommit = {
    commit: {
        message: 'Initial commit',
        author: {
            name: 'Developer',
            date: new Date().toISOString(),
        },
    },
    author: {
        login: 'dev',
    },
};

// --- Helper Functions ---
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

// --- Memoized Sub-components for Performance ---
const CommitPopover = memo(({ commit }: { commit: TGitHubCommit }) => {
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
});

const RepoStats = memo(({ stats }: { stats: TRepoStats }) => {
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
});


export function GitHubStats() {
    const [commits, setCommits] = useState<TGitHubCommit[]>([]);
    const [loading, setLoading] = useState(true);
    const [repoStats] = useState<TRepoStats>({
        stars: 42,
        forks: 13,
        pullRequests: 7,
        branch: 'main',
    });

    useEffect(() => {
        const fetchCommits = async () => {
            setLoading(true);
            try {
                const commitData = await getGithubCommits();
                setCommits(commitData?.length ? commitData : [fallbackCommit]);
            } catch (error) {
                console.error('Error fetching commits:', error);
                setCommits([fallbackCommit]);
            } finally {
                setLoading(false);
            }
        };
        fetchCommits();
    }, []);

    const latestCommit = commits[0];

    return (
        <div className="overflow-hidden relative border-t border-border/10 py-12 border-l border-r">
            <Waves
                className="absolute inset-0 z-0"
                backgroundColor="transparent"
                lineColor="hsl(var(--foreground) / 0.1)"
            />
            <div className="container mx-auto max-w-4xl relative z-10">
                <div className="flex flex-col items-center justify-center mb-8">
                    <div className="text-sm font-medium uppercase tracking-wider text-muted-foreground text-center">
                        architecture ● ryoa
                    </div>
                </div>

                <div className="flex flex-col items-center justify-center">
                    <div className="flex items-baseline justify-center gap-3">
                        <Popover>
                            <PopoverTrigger asChild>
                                <div className="relative group">
                                    <div className="text-7xl font-bold relative cursor-pointer bg-gradient-to-b from-foreground to-muted-foreground bg-clip-text text-transparent">
                                        {/* Change: Inline skeleton for a better loading UX */}
                                        {loading ? (
                                            <Skeleton className="h-24 w-32" />
                                        ) : (
                                            <span>{commits.length}</span>
                                        )}
                                    </div>
                                    {!loading && (
                                        <div className="absolute -right-2 -top-2 h-2 w-2 rounded-full bg-primary animate-pulse" />
                                    )}
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
                        <div className="text-xl font-medium text-muted-foreground">Commits</div>
                    </div>
                </div>

                {/* Commit info footer */}
                <div className="mt-8 flex justify-center">
                    <div className="flex items-center justify-between w-full max-w-2xl px-4 py-2 rounded-lg border border-border/20 bg-background/50 backdrop-blur-sm">
                        <div className="flex items-center gap-2">
                            <GitCommit className="h-4 w-4 text-primary" />
                            {/* Change: Simplified conditional rendering */}
                            <span className="text-sm text-muted-foreground hidden md:inline">
                                {latestCommit
                                    ? `${latestCommit.commit.message.slice(0, 50)}...`
                                    : 'No commits yet'}
                            </span>
                            {latestCommit && (
                                <span className="text-xs text-muted-foreground/60">
                                    {formatDate(new Date(latestCommit.commit.author.date))}
                                </span>
                            )}
                        </div>
                        <div className="flex items-center gap-2 text-primary">
                            <TreePalmIcon className="h-4 w-4" />
                            <span className="text-sm">{repoStats.branch}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}