import { ClientAnalyticsDashboard } from '@/modules/rollyourownanalytics/ui/client/analytics-dashboard';

/**
 * Renders the analytics dashboard for a demo project.
 *
 * @returns The analytics dashboard component for the demo project.
 *
 * @remark The project ID is currently hardcoded for demonstration purposes. In a production environment, it should be dynamically determined.
 */
export default function AnalyticsPage() {
	// For now, we'll use a demo project ID
	// In a real app, this would come from params or user selection
	const projectId = 'demo-project-id';

	return <ClientAnalyticsDashboard projectId={projectId} />;
}
