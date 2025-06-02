'use client';

import Text from '@/shared/components/text';

import { getGithubCommits } from '@/api/queries/get-github-commits';
import { GitHubStats } from '@/modules/landing/components/stats';
import {
    type ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from '@/shared/components/ui/charts';
import DottedMap from 'dotted-map';
import { GitCommit, Map as MapIcon, MessageCircle } from 'lucide-react';
import { useEffect, useMemo, useState, useRef } from 'react';
import { Area, AreaChart, CartesianGrid } from 'recharts';
import { EventItem } from './event';

type TGitHubCommit = {
    sha: string;
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

type TChartData = {
    date: string;
    bottom_layer: number;
    top_layer: number;
};

// Custom hook for intersection observer
function useIntersectionObserver(options = {}) {
    const [isIntersecting, setIsIntersecting] = useState(false);
    const [hasBeenVisible, setHasBeenVisible] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsIntersecting(entry.isIntersecting);
                if (entry.isIntersecting && !hasBeenVisible) {
                    setHasBeenVisible(true);
                }
            },
            {
                threshold: 0.2,
                rootMargin: '0px 0px -100px 0px',
                ...options,
            }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => {
            const currentRef = ref.current;
            if (currentRef) {
                observer.unobserve(currentRef);
            }
        };
    }, [hasBeenVisible]);

    return { ref, isIntersecting, hasBeenVisible };
}

function CommitPopover({ commit }: { commit: TGitHubCommit }) {
    return (
        <div className="bg-background dark:bg-muted absolute bottom-full mb-3 w-max max-w-sm rounded-md border px-3 py-2 text-xs font-medium shadow-md shadow-zinc-950/5 opacity-0 transition-all duration-300 group-hover:opacity-100 transform group-hover:-translate-y-2 ease-[cubic-bezier(0.4,0,0.2,1)]">
            <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm font-medium">
                    <GitCommit className="h-4 w-4" />
                    Latest Commit
                </div>
                <div className="text-xs text-muted-foreground">
                    <p className="font-medium text-foreground truncate">
                        {commit.commit.message}
                    </p>
                    <p className="mt-1">by {commit.commit.author?.name || 'Unknown'}</p>
                    <p>
                        {new Intl.DateTimeFormat('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                        }).format(new Date(commit.commit.author?.date))}
                    </p>
                </div>
            </div>
        </div>
    );
}

// Feature Block Component
function FeatureBlock({
    children,
    className = '',
}: {
    children: React.ReactNode;
    className?: string;
    delay?: number; // Keep parameter for compatibility but don't use it
}) {
    return (
        <div className={`${className}`}>
            {children}
        </div>
    );
}

export default function FeaturesSection() {
    const [commits, setCommits] = useState<TGitHubCommit[]>([]);
    const [chartData, setChartData] = useState<TChartData[]>([]);
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

    useEffect(() => {
        if (commits.length > 0) {
            const commitsByDay = commits.reduce(
                (acc: { [key: string]: number }, commit) => {
                    const date = new Date(commit.commit.author.date)
                        .toISOString()
                        .split('T')[0];
                    acc[date] = (acc[date] || 0) + 1;
                    return acc;
                },
                {}
            );

            const formattedChartData = Object.entries(commitsByDay)
                .map(([date, count]) => {
                    const bottomLayer = Math.max(1, Math.ceil(count / 3));
                    const topLayer = Math.max(0, count - bottomLayer);
                    return {
                        date,
                        bottom_layer: bottomLayer,
                        top_layer: topLayer,
                    };
                })
                .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

            setChartData(formattedChartData);
        }
    }, [commits]);

    return (
        <section className="py-16">
            <div className="mx-auto max-w-7xl grid border">
                <div className="grid md:grid-cols-2">
                    {/* Real-time Location Tracking Block */}
                    <FeatureBlock>
                        <div className="group cursor-pointer h-full">
                            <div className="p-6 sm:p-12 transition-all duration-300 group-hover:bg-muted/20">
                                <span className="text-muted-foreground flex items-center gap-2 transition-colors duration-300 group-hover:text-foreground">
                                    <MapIcon className="size-4 transition-transform duration-300 group-hover:scale-110" />
                                    <i className="mr-[2px]">R</i>oll your own analytics
                                </span>
                                <Text size="xl">
                                    Custom rolled analytics system with easy to integrate
                                    endpoints and full-fledged admin dashboard.
                                </Text>
                            </div>
                            <div
                                aria-hidden
                                className="relative overflow-hidden"
                                onMouseEnter={() => {
                                    // Find the EventItem and trigger its hover effect
                                    const eventItem =
                                        document.querySelector('.event-item');
                                    if (eventItem) {
                                        eventItem.classList.add('show-details');
                                    }
                                }}
                                onMouseLeave={() => {
                                    // Remove the hover effect when mouse leaves
                                    const eventItem =
                                        document.querySelector('.event-item');
                                    if (eventItem) {
                                        eventItem.classList.remove('show-details');
                                    }
                                }}
                            >
                                <div className="absolute inset-0 z-10 m-auto size-fit flex items-center justify-center">
                                    {/* Add event-item class to identify this element */}
                                    <EventItem forceHover={false} className="event-item" />
                                </div>
                                <div className="relative overflow-hidden transition-transform duration-500 group-hover:scale-[1.02]">
                                    <div className="bg-radial z-1 to-background absolute inset-0 from-transparent to-75%"></div>
                                    <Map />
                                </div>
                            </div>
                        </div>
                    </FeatureBlock>

                    {/* Email and Web Support Block */}
                    <FeatureBlock
                        className="border-t md:border-0 md:border-l"
                    >
                        <div className="group cursor-pointer h-full bg-transparent">
                            <div className="p-6 sm:p-12 transition-all duration-300 group-hover:bg-muted/20">
                                <div className="relative z-10">
                                    <span className="text-muted-foreground flex items-center gap-2 transition-colors duration-300 group-hover:text-foreground">
                                        <MessageCircle className="size-4 transition-transform duration-300 group-hover:scale-110" />
                                        Developer Support
                                    </span>
                                    <Text className="text-pretty hyphens-auto" size="xl">
                                        Get help from our team of developers and designers.
                                        We're here to help you build the best possible
                                        experience for your users.
                                    </Text>
                                </div>
                            </div>
                            <div
                                aria-hidden
                                className="flex flex-col gap-8 p-6 sm:px-12 pb-12 transition-transform duration-300 group-hover:translate-x-1"
                            >
                                <div>
                                    <div className="flex items-center gap-2">
                                        <Text>Sat 22 Feb</Text>
                                    </div>
                                </div>
                                <div>
                                    <div className="mb-1 ml-auto w-3/5 bg-blue-600 p-3 text-xs text-white transition-all duration-300 group-hover:bg-blue-500 group-hover:scale-[1.02]">
                                        <Text>
                                            Our authentication system provides secure user
                                            management with complete customization options.
                                        </Text>
                                    </div>
                                    <span className="text-muted-foreground block text-right text-xs transition-colors duration-300 group-hover:text-foreground">
                                        Now
                                    </span>
                                </div>
                            </div>
                        </div>
                    </FeatureBlock>
                </div>

                {/* GitHub Stats */}
                <FeatureBlock>
                    <GitHubStats />
                </FeatureBlock>

                {/* Monitoring Chart Block */}
                <FeatureBlock className="border-t">
                    <div className="group cursor-pointer relative h-full">
                        <div className="absolute z-10 max-w-lg px-6 pr-12 pt-6 md:px-12 md:pt-12 transition-all duration-300 group-hover:translate-x-1">
                            <div className="relative group/commit w-fit">
                                {!loading && commits.length > 0 && (
                                    <CommitPopover commit={commits[0]} />
                                )}
                                <p className="my-8 text-2xl font-semibold transition-all duration-300 group-hover:text-primary">
                                    Monitor your application's activity in real-time.{' '}
                                    <span className="text-muted-foreground transition-colors duration-300 group-hover:text-foreground/80">
                                        Instantly identify and resolve issues.
                                    </span>
                                </p>
                            </div>
                        </div>
                        <div className="transition-all duration-500 group-hover:scale-[1.01] group-hover:brightness-105">
                            <MonitoringChart data={chartData} />
                        </div>
                    </div>
                </FeatureBlock>
            </div>
        </section>
    );
}

const map = new DottedMap({ height: 55, grid: 'diagonal' });
const points = map.getPoints();
const svgOptions = {
    backgroundColor: 'var(--color-background)',
    color: 'currentColor',
    radius: 0.15,
};

const Map = () => {
    const viewBox = `0 0 120 60`;
    return (
        <svg viewBox={viewBox} style={{ background: svgOptions.backgroundColor }}>
            {points.map((point, index) => (
                <circle
                    key={index}
                    cx={point.x}
                    cy={point.y}
                    r={svgOptions.radius}
                    fill={svgOptions.color}
                    className="transition-all duration-300 hover:fill-primary"
                />
            ))}
        </svg>
    );
};

const chartConfig = {
    bottom_layer: {
        label: 'Commits',
        color: '#2563eb',
    },
    top_layer: {
        label: 'Commits',
        color: '#60a5fa',
    },
} satisfies ChartConfig;

const MonitoringChart = ({ data }: { data: TChartData[] }) => {
    return (
        <ChartContainer
            className="h-120 aspect-auto md:h-96"
            config={chartConfig}
        >
            <AreaChart
                accessibilityLayer
                data={data}
                margin={{
                    left: 0,
                    right: 0,
                    top: 0,
                    bottom: 0,
                }}
            >
                <defs>
                    <linearGradient id="fillBottom" x1="0" y1="0" x2="0" y2="1">
                        <stop
                            offset="0%"
                            stopColor="var(--color-bottom_layer)"
                            stopOpacity={0.8}
                        />
                        <stop
                            offset="55%"
                            stopColor="var(--color-bottom_layer)"
                            stopOpacity={0.1}
                        />
                    </linearGradient>
                    <linearGradient id="fillTop" x1="0" y1="0" x2="0" y2="1">
                        <stop
                            offset="0%"
                            stopColor="var(--color-top_layer)"
                            stopOpacity={0.8}
                        />
                        <stop
                            offset="55%"
                            stopColor="var(--color-top_layer)"
                            stopOpacity={0.1}
                        />
                    </linearGradient>
                </defs>
                <CartesianGrid vertical={false} />
                <ChartTooltip
                    active
                    cursor={false}
                    content={<ChartTooltipContent className="dark:bg-muted" />}
                />
                <Area
                    strokeWidth={2}
                    dataKey="top_layer"
                    type="stepBefore"
                    fill="url(#fillTop)"
                    fillOpacity={0.1}
                    stroke="var(--color-top_layer)"
                    stackId="a"
                />
                <Area
                    strokeWidth={2}
                    dataKey="bottom_layer"
                    type="stepBefore"
                    fill="url(#fillBottom)"
                    fillOpacity={0.1}
                    stroke="var(--color-bottom_layer)"
                    stackId="a"
                />
            </AreaChart>
        </ChartContainer>
    );
};
