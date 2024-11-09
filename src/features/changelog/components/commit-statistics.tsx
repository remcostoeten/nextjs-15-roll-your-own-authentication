'use client'

import { CommitStats } from '@/features/analytics/components/actions/changelog'
import {
	Area,
	AreaChart,
	Cell,
	Pie,
	PieChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from 'ui'

type CommitStatisticsProps = {
	stats: CommitStats
}

export default function CommitStatistics({ stats }: CommitStatisticsProps) {
	const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']

	const languageData = Object.entries(stats.languageDistribution).map(
		([name, value]) => ({
			name,
			value
		})
	)

	return (
		<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
			<Card>
				<CardHeader>
					<CardTitle>Commit Activity</CardTitle>
				</CardHeader>
				<CardContent className="h-[300px]">
					<ResponsiveContainer width="100%" height="100%">
						<AreaChart data={stats.commitTrend}>
							<defs>
								<linearGradient
									id="commitGradient"
									x1="0"
									y1="0"
									x2="0"
									y2="1"
								>
									<stop
										offset="5%"
										stopColor="#0088FE"
										stopOpacity={0.8}
									/>
									<stop
										offset="95%"
										stopColor="#0088FE"
										stopOpacity={0}
									/>
								</linearGradient>
							</defs>
							<XAxis dataKey="date" />
							<YAxis />
							<Tooltip
								contentStyle={{
									background: 'rgba(0,0,0,0.8)',
									border: 'none',
									borderRadius: '6px',
									padding: '12px'
								}}
							/>
							<Area
								type="monotone"
								dataKey="commits"
								stroke="#0088FE"
								fillOpacity={1}
								fill="url(#commitGradient)"
							/>
						</AreaChart>
					</ResponsiveContainer>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>Language Distribution</CardTitle>
				</CardHeader>
				<CardContent className="h-[300px]">
					<ResponsiveContainer width="100%" height="100%">
						<PieChart>
							<Pie
								data={languageData}
								innerRadius={60}
								outerRadius={80}
								paddingAngle={5}
								dataKey="value"
							>
								{languageData.map((entry, index) => (
									<Cell
										key={`cell-${index}`}
										fill={COLORS[index % COLORS.length]}
									/>
								))}
							</Pie>
							<Tooltip />
						</PieChart>
					</ResponsiveContainer>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>Top Contributors</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="space-y-4">
						{stats.topContributors.map((contributor, index) => (
							<div
								key={contributor.name}
								className="flex items-center justify-between"
							>
								<div className="flex items-center gap-2">
									<span className="text-sm font-medium">
										{contributor.name}
									</span>
								</div>
								<div className="flex items-center gap-2">
									<span className="text-sm text-neutral-400">
										{contributor.commits} commits
									</span>
									<div
										className="h-2 w-24 bg-neutral-800 rounded-full overflow-hidden"
										title={`${((contributor.commits / stats.totalCommits) * 100).toFixed(1)}%`}
									>
										<div
											className="h-full bg-blue-500"
											style={{
												width: `${(contributor.commits / stats.totalCommits) * 100}%`
											}}
										/>
									</div>
								</div>
							</div>
						))}
					</div>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>Most Changed Files</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="space-y-4">
						{stats.mostChangedFiles.slice(0, 5).map((file) => (
							<div
								key={file.filename}
								className="flex items-center justify-between"
							>
								<span
									className="text-sm truncate max-w-[200px]"
									title={file.filename}
								>
									{file.filename}
								</span>
								<Badge variant="secondary">
									{file.changes} changes
								</Badge>
							</div>
						))}
					</div>
				</CardContent>
			</Card>
		</div>
	)
}
