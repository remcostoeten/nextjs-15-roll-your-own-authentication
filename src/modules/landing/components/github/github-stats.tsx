'use client';

import { getGithubCommits } from '@/api/queries/get-github-commits';
import { AnimatedContent, AnimatedText, SHARED_ANIMATION_CONFIG } from '@/shared/components/effects/animated-content';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/components/ui/popover';
import { Skeleton } from '@/shared/components/ui/skeleton';
import NumberFlow from '@number-flow/react';
import { GitCommit } from 'lucide-react';
import { Suspense, useEffect, useRef, useState } from 'react';

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

type TGitHubBranch = {
	name: string;
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

function TimePopover({ firstCommitDate, lastCommitDate, hoursSinceLastPush }: {
	firstCommitDate: string;
	lastCommitDate: string;
	hoursSinceLastPush: number;
}) {
	return (
		<div className="space-y-2">
			<div className="text-sm font-medium">Time Details</div>
			<div className="space-y-1 text-xs text-muted-foreground">
				<p>Started: {formatDate(new Date(firstCommitDate))}</p>
				<p>Last push: {formatDate(new Date(lastCommitDate))}</p>
				<p>{Math.floor(hoursSinceLastPush / 24)} days ago</p>
			</div>
		</div>
	);
}

export function GitHubStats() {
	const [repoName, setRepoName] = useState('ryoa');
	const [commits, setCommits] = useState<TGitHubCommit[]>([]);
	const [currentBranch, setCurrentBranch] = useState('main');
	const [loading, setLoading] = useState(true);
	const [isTimePopoverOpen, setIsTimePopoverOpen] = useState(false);
	const [isCommitPopoverOpen, setIsCommitPopoverOpen] = useState(false);
	const timeoutRef = useRef<NodeJS.Timeout | null>(null);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const [commitResult, branchResult] = await Promise.all([
					getGithubCommits(),
					fetch('https://api.github.com/repos/remcostoeten/architecture-ryoa/branches').then(res => res.json())
				]);
				setCommits(commitResult || []);
				if (Array.isArray(branchResult)) {
					const defaultBranch = branchResult.find((branch: TGitHubBranch) => branch.name === 'main');
					setCurrentBranch(defaultBranch?.name || 'main');
				}
			} catch (error) {
				console.error('Error fetching data:', error);
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, []);

	const lastPushTime = commits[0]?.commit?.author?.date
		? new Date(commits[0].commit.author.date)
		: null;

	const timeSinceLastPush = lastPushTime
		? Math.floor((new Date().getTime() - lastPushTime.getTime()) / (1000 * 60 * 60))
		: null;

	const contributorsSet = new Set(commits.map(commit => commit.author?.login).filter(Boolean));
	const contributorsCount = contributorsSet.size;

	const handlePopoverOpenChange = (open: boolean, type: 'time' | 'commit') => {
		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current);
		}
		if (type === 'time') {
			setIsTimePopoverOpen(open);
		} else {
			setIsCommitPopoverOpen(open);
		}
	};

	return (
		<div className="border-t border-gray-800 py-12 transition-all duration-300 hover:bg-gray-900/30">
			<AnimatedContent className="flex flex-col items-center justify-center space-y-3 relative" delay={0.6}>
				<AnimatedText className="text-sm font-medium uppercase tracking-wider text-gray-500 text-center w-full px-4" delay={0.7}>
					{repoName.replace(/-/g, ' ● ')}
				</AnimatedText>

				{/* Commit Count */}
				<div className="flex items-baseline justify-center w-full">
					<div className="flex items-baseline">
						<Suspense fallback={<Skeleton className="h-10 w-24" />}>
							<Popover open={isCommitPopoverOpen} onOpenChange={(open) => handlePopoverOpenChange(open, 'commit')}>
								<PopoverTrigger asChild>
									<div className="text-7xl font-bold text-white relative cursor-pointer group">
										<NumberFlow
											value={commits.length}
											transformTiming={SHARED_ANIMATION_CONFIG.numberFlow.transform}
											spinTiming={SHARED_ANIMATION_CONFIG.numberFlow.spin}
											opacityTiming={SHARED_ANIMATION_CONFIG.numberFlow.opacity}
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
									{commits[0] && <CommitPopover commit={commits[0]} />}
								</PopoverContent>
							</Popover>
						</Suspense>
						<AnimatedText className="ml-3 text-xl font-medium text-gray-400">
							Commits
						</AnimatedText>
					</div>
				</div>

				{/* Stats Row */}
				<div className="flex items-center justify-center w-full space-x-8 text-xs text-gray-500">
					{/* Last Push Time */}
					<div className="flex items-center">
						<span className="mr-1.5 h-1 w-1 rounded-full bg-gray-600" />
						<span className="flex items-center gap-1">
							<AnimatedText>Last push:</AnimatedText>
							{loading ? (
								"Loading..."
							) : timeSinceLastPush ? (
								<Popover
									open={isTimePopoverOpen}
									onOpenChange={(open) => handlePopoverOpenChange(open, 'time')}
								>
									<PopoverTrigger asChild>
										<div className="flex items-center gap-1 cursor-pointer group">
											<NumberFlow
												value={timeSinceLastPush}
												transformTiming={SHARED_ANIMATION_CONFIG.numberFlow.transform}
												spinTiming={SHARED_ANIMATION_CONFIG.numberFlow.spin}
												opacityTiming={SHARED_ANIMATION_CONFIG.numberFlow.opacity}
												format={{ notation: 'standard' }}
												willChange={true}
											/>
											<AnimatedText className="group-hover:text-blue-400 transition-colors">
												h ago
											</AnimatedText>
										</div>
									</PopoverTrigger>
									<PopoverContent
										className="w-64 p-4 bg-card/80 backdrop-blur-sm border border-border/50"
										sideOffset={5}
									>
										{commits.length > 0 && (
											<TimePopover
												firstCommitDate={commits[commits.length - 1].commit.author.date}
												lastCommitDate={commits[0].commit.author.date}
												hoursSinceLastPush={timeSinceLastPush}
											/>
										)}
									</PopoverContent>
								</Popover>
							) : (
								"N/A"
							)}
						</span>
					</div>

					{/* Contributors Count */}
					<div className="flex items-center">
						<span className="mr-1.5 h-1 w-1 rounded-full bg-gray-600" />
						<span className="flex items-center gap-1">
							{loading ? (
								"Loading..."
							) : (
								<>
									<NumberFlow
										value={contributorsCount}
										transformTiming={SHARED_ANIMATION_CONFIG.numberFlow.transform}
										spinTiming={SHARED_ANIMATION_CONFIG.numberFlow.spin}
										opacityTiming={SHARED_ANIMATION_CONFIG.numberFlow.opacity}
										format={{ notation: 'standard' }}
										willChange={true}
									/>
									<AnimatedText>contributors</AnimatedText>
								</>
							)}
						</span>
					</div>
				</div>

				{/* Branch Info */}
				<div className="absolute bottom-2 right-4 flex items-baseline opacity-60 hover:opacity-100 transition-opacity">
					<span className="text-sm font-mono text-gray-400">./</span>
					<span className="text-sm font-mono text-white">{currentBranch}</span>
				</div>

				<div className="mt-4 w-24 border-t border-gray-800" />
			</AnimatedContent>
		</div>
	);
}
