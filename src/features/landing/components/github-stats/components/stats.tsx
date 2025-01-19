'use client'

import { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ReferenceArea } from 'recharts';
import { getGithubStats, type GithubStats } from '@/services/github-stats.service';
import { Container } from '@/components/layout/container';
import Text from '@/shared/components/defaults/text';

interface DataPoint {
  date: string;
  messages: number;
}

const REPO_OWNER = 'remcostoeten';
const REPO_NAME = 'nextjs-lucia-neon-postgresql-drizzle-dashboard';

const generateData = (dailyCommits: { [date: string]: number }) => {
  const data: DataPoint[] = [];
  const dates = Object.keys(dailyCommits).sort();
  
  if (dates.length > 0) {
    const startDate = new Date(dates[0]);
    const endDate = new Date(dates[dates.length - 1]);
    const currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      const dateString = currentDate.toISOString().split('T')[0];
      data.push({
        date: dateString,
        messages: dailyCommits[dateString] || 0,
      });
      currentDate.setDate(currentDate.getDate() + 1);
    }
  }
  
  return data;
};

interface TooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
    payload: DataPoint;
  }>;
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: TooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="chart-tooltip bg-[#1a1a1a] p-3 border border-[#333] rounded-md">
        <Text color="muted" size="sm" className="mb-1">
          {new Date(label || '').toLocaleDateString('en-US', { 
            day: '2-digit',
            month: 'short',
            year: 'numeric'
          })}
        </Text>
        <Text color="default" weight="medium">
          {payload[0].value} commits
        </Text>
      </div>
    );
  }
  return null;
};

const StatsChart = () => {
  const [stats, setStats] = useState<GithubStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [refAreaLeft, setRefAreaLeft] = useState<string | null>(null);
  const [refAreaRight, setRefAreaRight] = useState<string | null>(null);
  const [chartData, setChartData] = useState<DataPoint[]>([]);
  const [originalData, setOriginalData] = useState<DataPoint[]>([]);

  useEffect(() => {
    async function fetchStats() {
      try {
        const data = await getGithubStats(REPO_OWNER, REPO_NAME);
        setStats(data);
        const generatedData = generateData(data.dailyCommits);
        setChartData(generatedData);
        setOriginalData(generatedData);
      } catch (error) {
        console.error('Error fetching GitHub stats:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchStats();
  }, []);

  const zoom = () => {
    if (refAreaLeft === refAreaRight || refAreaRight === null) {
      setRefAreaLeft(null);
      setRefAreaRight(null);
      return;
    }

    let left = refAreaLeft;
    let right = refAreaRight;

    if (refAreaLeft && refAreaRight && refAreaLeft > refAreaRight) {
      left = refAreaRight;
      right = refAreaLeft;
    }

    const filteredData = originalData.filter(
      (entry) => entry.date >= left! && entry.date <= right!
    );

    setChartData(filteredData);
    setRefAreaLeft(null);
    setRefAreaRight(null);
  };

  const zoomOut = () => {
    setChartData(originalData);
  };

  return (
    <Container>
      <div className="w-full min-h-screen p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-4">
              <Text color="muted">[ {new Date().toLocaleDateString('en-US', { day: '2-digit', month: '2-digit', year: 'numeric' })} ]</Text>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-[#4CAF50] animate-pulse rounded-full"></div>
                <Text color="brand" size="sm">MASTER BRANCH</Text>
              </div>
            </div>
            <a 
              href={`https://github.com/${REPO_OWNER}/${REPO_NAME}`}
              target="_blank"
              rel="noopener noreferrer" 
              className="relative px-4 py-2 text-sm text-[#888] hover:text-white transition-colors group"
            >
              <span className="relative z-10">VIEW ON GITHUB</span>
              <div className="absolute inset-0 border border-[#333] opacity-50 group-hover:opacity-100 transition-opacity">
                <div className="absolute inset-y-0 left-0 w-[1px] bg-gradient-to-b from-[#333] via-[#333] to-transparent"></div>
                <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-[#333] via-[#333] to-transparent"></div>
                <div className="absolute inset-y-0 right-0 w-[1px] bg-gradient-to-b from-[#333] via-transparent to-transparent"></div>
                <div className="absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-[#333] via-transparent to-transparent"></div>
              </div>
            </a>
          </div>

          <div className="grid grid-cols-2 gap-8 mb-8">
            <div>
              <Text color="muted" size="sm" className="mb-1">TOTAL COMMITS</Text>
              <Text size="2xl" weight="light" className="text-6xl">
                {isLoading ? '...' : stats?.totalCommits?.toLocaleString()}
              </Text>
              <Text color="muted" size="sm" className="mt-2">
                Since {stats?.firstCommitDate ? new Date(stats.firstCommitDate).toLocaleDateString('en-US', {
                  month: 'long',
                  year: 'numeric'
                }) : '...'}
              </Text>
            </div>
            <div>
              <Text color="muted" size="sm" className="mb-1">LINES OF CODE</Text>
              <Text size="2xl" weight="light" className="text-6xl">
                {isLoading ? '...' : stats?.totalLinesOfCodeWritten}
              </Text>
              <Text color="muted" size="sm" className="mt-2">
                {isLoading ? '...' : `${stats?.totalFilesAdded} files`}
              </Text>
            </div>
          </div>

          <div className="h-[400px] mb-8 relative">
            <button
              onClick={zoomOut}
              className="absolute top-2 right-2 z-10 bg-[#1a1a1a] border border-[#333] px-3 py-1 rounded text-sm text-[#888] hover:bg-[#333] transition-colors"
            >
              Reset Zoom
            </button>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={chartData}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                onMouseDown={(e) => e?.activeLabel && setRefAreaLeft(e.activeLabel)}
                onMouseMove={(e) => e?.activeLabel && refAreaLeft && setRefAreaRight(e.activeLabel)}
                onMouseUp={zoom}
              >
                <defs>
                  <linearGradient id="colorMessages" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#333" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#333" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid 
                  vertical={true}
                  horizontal={false}
                  stroke="#333"
                  strokeDasharray="0"
                  opacity={0.5}
                />
                <XAxis 
                  dataKey="date" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#666', fontSize: 12 }}
                  minTickGap={50}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#666', fontSize: 12 }}
                  width={40}
                />
                <Tooltip 
                  content={<CustomTooltip />}
                  cursor={{
                    stroke: '#444',
                    strokeWidth: 1,
                    strokeDasharray: "0",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="messages"
                  stroke="#444"
                  strokeWidth={2}
                  fill="url(#colorMessages)"
                  isAnimationActive={false}
                />
                {refAreaLeft && refAreaRight && (
                  <ReferenceArea
                    x1={refAreaLeft}
                    x2={refAreaRight}
                    strokeOpacity={0.3}
                    fill="#444"
                    fillOpacity={0.3}
                  />
                )}
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-4 border border-[#333] stats-border">
            <div className="p-8 border-r stats-border">
              <Text color="muted" size="sm" className="mb-2">
                COMMITS<br />THIS MONTH
              </Text>
              <Text size="xl" weight="light">
                {isLoading ? '...' : stats?.totalCommitsLastMonth?.toLocaleString()}
              </Text>
            </div>
            <div className="p-8 border-r stats-border">
              <Text color="muted" size="sm" className="mb-2">
                COMMITS<br />THIS WEEK
              </Text>
              <Text size="xl" weight="light">
                {isLoading ? '...' : stats?.totalCommitsLastWeek?.toLocaleString()}
              </Text>
            </div>
            <div className="p-8 border-r stats-border">
              <Text color="muted" size="sm" className="mb-2">
                PULL REQUESTS<br />MERGED
              </Text>
              <Text size="xl" weight="light">
                {isLoading ? '...' : stats?.totalPullRequestsCreatedMerged?.toLocaleString()}
              </Text>
            </div>
            <div className="p-8">
              <Text color="muted" size="sm" className="mb-2">
                AVERAGE COMMITS<br />PER DAY
              </Text>
              <Text size="xl" weight="light">
                {isLoading ? '...' : stats?.averageCommitsPerDay?.toFixed(1)}
              </Text>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default StatsChart;