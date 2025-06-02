'use client';

import { Activity, AlertCircle, CheckCircle2, Clock, Cpu, Database, Shield } from 'lucide-react';
import {
	CartesianGrid,
	Line,
	LineChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from 'recharts';

const systemHealth = [
	{
		name: 'API Response Time',
		value: '124ms',
		status: 'healthy',
		icon: Clock,
	},
	{
		name: 'Database Load',
		value: '42%',
		status: 'healthy',
		icon: Database,
	},
	{
		name: 'CPU Usage',
		value: '28%',
		status: 'healthy',
		icon: Cpu,
	},
	{
		name: 'Auth Success Rate',
		value: '99.9%',
		status: 'healthy',
		icon: CheckCircle2,
	},
];

const recentActivity = [
	{
		id: 1,
		type: 'auth',
		message: 'New user registration',
		timestamp: '2 minutes ago',
		status: 'success',
	},
	{
		id: 2,
		type: 'system',
		message: 'Database backup completed',
		timestamp: '15 minutes ago',
		status: 'success',
	},
	{
		id: 3,
		type: 'auth',
		message: 'Failed login attempt',
		timestamp: '23 minutes ago',
		status: 'warning',
	},
	{
		id: 4,
		type: 'system',
		message: 'System update completed',
		timestamp: '1 hour ago',
		status: 'success',
	},
	{
		id: 5,
		type: 'auth',
		message: 'Password reset requested',
		timestamp: '2 hours ago',
		status: 'info',
	},
];

const performanceData = [
	{ time: '00:00', latency: 120, load: 45 },
	{ time: '04:00', latency: 80, load: 30 },
	{ time: '08:00', latency: 150, load: 65 },
	{ time: '12:00', latency: 280, load: 80 },
	{ time: '16:00', latency: 350, load: 95 },
	{ time: '20:00', latency: 220, load: 70 },
	{ time: '23:59', latency: 170, load: 55 },
];

/**
 * Displays a system monitoring dashboard with real-time health metrics, performance chart, and activity stream.
 *
 * Renders system health indicators, a performance line chart, and a live feed of recent system activities using static data arrays.
 */
export function ActivityFeed() {
	return (
		<div className="w-full max-w-7xl mx-auto px-4 py-8">
			<div className="mb-8">
				<h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
					System Monitor
				</h2>
				<p className="text-gray-600 dark:text-gray-400">
					Monitor your application's activity in real-time. Instantly identify and resolve
					issues.
				</p>
			</div>

			{/* System Health Grid */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
				{systemHealth.map((metric) => (
					<div
						key={metric.name}
						className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg"
					>
						<div className="flex items-center justify-between mb-4">
							<div className="p-3 rounded-lg bg-green-100 dark:bg-green-900">
								<metric.icon className="h-6 w-6 text-green-600 dark:text-green-400" />
							</div>
							<span className="text-sm font-medium text-green-500">
								{metric.status === 'healthy' ? 'Healthy' : 'Warning'}
							</span>
						</div>
						<h3 className="text-2xl font-bold text-gray-900 dark:text-white">
							{metric.value}
						</h3>
						<p className="text-sm text-gray-600 dark:text-gray-400">{metric.name}</p>
					</div>
				))}
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
				{/* Performance Chart */}
				<div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
					<h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
						System Performance
					</h3>
					<div className="h-[300px]">
						<ResponsiveContainer width="100%" height="100%">
							<LineChart data={performanceData}>
								<defs>
									<linearGradient id="colorLatency" x1="0" y1="0" x2="0" y2="1">
										<stop
											offset="5%"
											stopColor="hsl(var(--accent))"
											stopOpacity={0.8}
										/>
										<stop
											offset="95%"
											stopColor="hsl(var(--accent))"
											stopOpacity={0}
										/>
									</linearGradient>
								</defs>
								<CartesianGrid strokeDasharray="3 3" opacity={0.1} />
								<XAxis
									dataKey="time"
									stroke="#94a3b8"
									fontSize={12}
									tickLine={false}
								/>
								<YAxis stroke="#94a3b8" fontSize={12} tickLine={false} />
								<Tooltip
									contentStyle={{
										backgroundColor: 'rgba(255, 255, 255, 0.8)',
										borderRadius: '8px',
										border: 'none',
										boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
									}}
								/>
								<Line
									type="monotone"
									dataKey="latency"
									name="Latency (ms)"
									stroke="hsl(var(--accent))"
									strokeWidth={2}
									dot={false}
								/>
								<Line
									type="monotone"
									dataKey="load"
									name="System Load (%)"
									stroke="hsl(var(--primary))"
									strokeWidth={2}
									dot={false}
								/>
							</LineChart>
						</ResponsiveContainer>
					</div>
				</div>

				{/* Activity Stream */}
				<div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
					<h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
						<Activity className="w-5 h-5 mr-2" />
						Live Activity Stream
					</h3>
					<div className="space-y-4">
						{recentActivity.map((activity) => (
							<div
								key={activity.id}
								className="flex items-start space-x-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50"
							>
								<div
									className={`
                  p-2 rounded-full
                  ${activity.status === 'success' ? 'bg-green-100 dark:bg-green-900' : ''}
                  ${activity.status === 'warning' ? 'bg-yellow-100 dark:bg-yellow-900' : ''}
                  ${activity.status === 'info' ? 'bg-blue-100 dark:bg-blue-900' : ''}
                `}
								>
									{activity.status === 'success' && (
										<CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" />
									)}
									{activity.status === 'warning' && (
										<AlertCircle className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
									)}
									{activity.status === 'info' && (
										<Shield className="w-4 h-4 text-blue-600 dark:text-blue-400" />
									)}
								</div>
								<div className="flex-1">
									<p className="text-sm font-medium text-gray-900 dark:text-white">
										{activity.message}
									</p>
									<p className="text-xs text-gray-500 dark:text-gray-400">
										{activity.timestamp}
									</p>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}
