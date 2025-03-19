import { NetworkRequest, ConsoleLog, PerformanceMetric } from './types'

export const DEFAULT_NETWORK_REQUESTS: NetworkRequest[] = [
	{
		id: '1',
		url: '/api/users',
		method: 'GET',
		status: 200,
		startTime: Date.now() - 350,
		endTime: Date.now() - 230,
		duration: 120,
		size: 1240,
		type: 'api',
		initiator: 'fetch',
		waterfall: {
			dns: 5,
			connect: 15,
			ssl: 20,
			wait: 50,
			download: 30,
		},
	},
	// ... other default requests
]

export const DEFAULT_CONSOLE_LOGS: ConsoleLog[] = [
	{
		id: '1',
		type: 'log',
		message: 'Application initialized',
		timestamp: new Date(Date.now() - 120000),
	},
	// ... other default logs
]

export const DEFAULT_PERFORMANCE_METRICS: PerformanceMetric[] = [
	{ name: 'First Contentful Paint', value: 1.2, unit: 's' },
	{ name: 'Largest Contentful Paint', value: 2.5, unit: 's' },
	{ name: 'First Input Delay', value: 120, unit: 'ms' },
	{ name: 'Cumulative Layout Shift', value: 0.05, unit: '' },
	{ name: 'Memory Usage', value: 42.8, unit: 'MB' },
]

export const DEFAULT_ENV_VARS = {
	NEXT_PUBLIC_API_URL: 'https://api.example.com',
	NEXT_PUBLIC_APP_ENV: 'development',
	NEXT_PUBLIC_FEATURE_FLAGS: 'new_dashboard,dark_mode',
}

export const WIDGET_SIZES = {
	small: {
		button: 'w-6 h-6',
		icon: 'w-3 h-3',
	},
	normal: {
		button: 'w-8 h-8',
		icon: 'w-4 h-4',
	},
	large: {
		button: 'w-10 h-10',
		icon: 'w-5 h-5',
	},
}
