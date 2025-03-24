export type CornerPosition = 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right'

export type PositionConfig = {
	corner: CornerPosition
	offsetX: number
	offsetY: number
}

export type WidgetPosition = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'custom'
export type WidgetSize = 'small' | 'normal' | 'large'

export type NetworkRequest = {
	id: string
	url: string
	method: string
	status: number
	startTime: number
	endTime: number
	duration: number
	size: number
	type: 'api' | 'asset' | 'document' | 'font' | 'query' | 'other'
	queryName?: string
	queryType?: 'drizzle' | 'prisma' | 'raw-sql' | 'other'
	initiator: string
	waterfall: {
		dns: number
		connect: number
		ssl: number
		wait: number
		download: number
	}
}

export type ConsoleLog = {
	id: string
	type: 'log' | 'info' | 'warn' | 'error'
	message: string
	timestamp: Date
}

export type PerformanceMetric = {
	name: string
	value: number
	unit: string
}

export type DevAction = {
	id: string
	name: string
	description: string
	action: () => void
	icon: React.ReactNode
}

export interface DevToolsWidgetProps {
	allowDrag?: boolean
	showInProduction?: boolean
	authInfo?: {
		isAuthenticated: boolean
		user?: {
			name?: string
			email?: string
			createdAt?: Date | string
			isOnline?: boolean
		}
		token?: string
		onLogout?: () => void
		onTokenRefresh?: () => void
	}
}
