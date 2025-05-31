export type TAnalyticsEvent = {
	id?: string | undefined;
	projectId: string;
	sessionId: string;
	type: 'pageview' | 'click' | 'form_submit' | 'scroll' | 'custom' | 'error';
	name?: string | undefined;
	url: string;
	pathname: string;
	referrer?: string | undefined;
	title?: string | undefined;
	userAgent?: string | undefined;
	country?: string | undefined;
	city?: string | undefined;
	region?: string | undefined;
	timezone?: string | undefined;
	language?: string | undefined;
	device?: 'desktop' | 'mobile' | 'tablet' | undefined;
	browser?: string | undefined;
	os?: string | undefined;
	screenWidth?: number | undefined;
	screenHeight?: number | undefined;
	viewportWidth?: number | undefined;
	viewportHeight?: number | undefined;
	timestamp: Date;
	duration?: number | undefined;
	scrollDepth?: number | undefined;
	exitPage?: boolean | undefined;
	bounced?: boolean | undefined;
	utmSource?: string | undefined;
	utmMedium?: string | undefined;
	utmCampaign?: string | undefined;
	utmTerm?: string | undefined;
	utmContent?: string | undefined;
	metadata?: Record<string, any> | undefined;
};

export type TAnalyticsSession = {
	id: string;
	projectId: string;
	userId?: string;
	visitorId: string;
	userAgent?: string;
	ipAddress?: string;
	country?: string;
	city?: string;
	region?: string;
	timezone?: string;
	language?: string;
	device?: 'desktop' | 'mobile' | 'tablet';
	browser?: string;
	os?: string;
	referrer?: string;
	utmSource?: string;
	utmMedium?: string;
	utmCampaign?: string;
	utmTerm?: string;
	utmContent?: string;
	startedAt: Date;
	endedAt?: Date;
	duration?: number;
	pageviews: number;
	events: number;
	bounced?: boolean;
};

export type TAnalyticsProject = {
	id: string;
	name: string;
	domain: string;
	publicKey: string;
	isActive: boolean;
	settings?: Record<string, any>;
	createdAt: Date;
	updatedAt: Date;
};

export type TAnalyticsFunnel = {
	id: string;
	projectId: string;
	name: string;
	description?: string;
	steps: TFunnelStep[];
	isActive: boolean;
	createdAt: Date;
	updatedAt: Date;
};

export type TFunnelStep = {
	id: string;
	name: string;
	type: 'pageview' | 'event';
	conditions: Record<string, any>;
	order: number;
};

export type TAnalyticsGoal = {
	id: string;
	projectId: string;
	name: string;
	description?: string;
	type: 'pageview' | 'event' | 'duration';
	conditions: Record<string, any>;
	value?: number;
	isActive: boolean;
	createdAt: Date;
	updatedAt: Date;
};

export type TAnalyticsMetrics = {
	totalPageviews: number;
	totalSessions: number;
	totalUsers: number;
	bounceRate: number;
	avgSessionDuration: number;
	avgPageDuration: number;
	topPages: TPageMetric[];
	topCountries: TCountryMetric[];
	topDevices: TDeviceMetric[];
	topBrowsers: TBrowserMetric[];
	realtimeVisitors: number;
	conversionRate?: number;
};

export type TPageMetric = {
	pathname: string;
	title?: string;
	views: number;
	uniqueViews: number;
	avgDuration: number;
	bounceRate: number;
	exitRate: number;
};

export type TCountryMetric = {
	country: string;
	sessions: number;
	percentage: number;
};

export type TDeviceMetric = {
	device: string;
	sessions: number;
	percentage: number;
};

export type TBrowserMetric = {
	browser: string;
	sessions: number;
	percentage: number;
};

export type TAnalyticsFilter = {
	startDate?: Date;
	endDate?: Date;
	country?: string;
	device?: string;
	browser?: string;
	pathname?: string;
	utmSource?: string;
	utmMedium?: string;
	utmCampaign?: string;
};

export type TGeoLocation = {
	country?: string;
	city?: string;
	region?: string;
	timezone?: string;
};

export type TDeviceInfo = {
	device: 'desktop' | 'mobile' | 'tablet';
	browser: string;
	os: string;
	screenWidth: number;
	screenHeight: number;
	viewportWidth: number;
	viewportHeight: number;
};

export type TUtmParams = {
	utmSource?: string;
	utmMedium?: string;
	utmCampaign?: string;
	utmTerm?: string;
	utmContent?: string;
};

export type TAnalyticsConfig = {
	projectId: string;
	domain?: string;
	trackPageviews?: boolean;
	trackClicks?: boolean;
	trackForms?: boolean;
	trackScrolling?: boolean;
	trackErrors?: boolean;
	anonymizeIp?: boolean;
	respectDnt?: boolean;
	cookieless?: boolean;
	debug?: boolean;
};

export type TTrackingContext = {
	projectId: string;
	sessionId: string;
	visitorId: string;
	config: TAnalyticsConfig;
};
