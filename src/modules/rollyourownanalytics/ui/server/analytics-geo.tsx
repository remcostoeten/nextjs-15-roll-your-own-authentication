import { TAnalyticsFilter } from '@/modules/rollyourownanalytics/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from 'ui';

type TProps = {
	projectId: string;
	filter?: TAnalyticsFilter;
};

export function AnalyticsGeo({ projectId, filter }: TProps) {
	return (
		<Card>
			<CardHeader>
				<CardTitle>Geographic Data</CardTitle>
				<CardDescription>Visitor locations and geographic insights</CardDescription>
			</CardHeader>
			<CardContent>
				<div className="text-center text-muted-foreground py-8">
					Geographic analytics coming soon...
				</div>
			</CardContent>
		</Card>
	);
}
