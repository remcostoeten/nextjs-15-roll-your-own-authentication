import { ClientAnalyticsDashboard } from '@/modules/rollyourownanalytics/ui/client/analytics-dashboard';

export default function AnalyticsPage() {
	// For now, we'll use a demo project ID
	// In a real app, this would come from params or user selection
	const projectId = 'demo-project-id';

	return <ClientAnalyticsDashboard projectId={projectId} />;
}
