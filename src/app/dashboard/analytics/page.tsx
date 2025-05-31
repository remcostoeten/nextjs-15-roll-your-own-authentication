import { AnalyticsDashboard } from "../../../../rc/modules/rollyourownanalytics/ui/src/modules/rollyourownanalytics/ui/src/modules/rollyourownanalytics/ui/analytics-dashboard";


export default function AnalyticsPage() {
	// For now, we'll use a demo project ID
	// In a real app, this would come from params or user selection
	const projectId = "demo-project-id";

	return <AnalyticsDashboard projectId={projectId} />
}
