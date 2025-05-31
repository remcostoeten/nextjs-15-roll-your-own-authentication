export type TProps = {
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

export const analyticsConfig: TProps = {
	projectId: 'demo-project-id',
	domain: 'localhost:3000',
	trackPageviews: true,
	trackClicks: true,
	trackForms: true,
	trackScrolling: true,
	trackErrors: true,
	anonymizeIp: true,
	respectDnt: true,
	cookieless: false,
	debug: process.env.NODE_ENV === 'development',
};
