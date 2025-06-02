import { TAnalyticsFilter } from '@/modules/rollyourownanalytics/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from 'ui';

type TProps = {
	projectId: string;
	filter?: TAnalyticsFilter;
};

export function AnalyticsPages({ projectId, filter }: TProps) {
	return (
		<Card>
			<CardHeader>
				<CardTitle>Top Pages</CardTitle>
				<CardDescription>Most visited pages in your application</CardDescription>
			</CardHeader>
			<CardContent>
				<div className="text-center text-muted-foreground py-8">
					Pages analytics coming soon...
				</div>
			</CardContent>
		</Card>
	);
}
