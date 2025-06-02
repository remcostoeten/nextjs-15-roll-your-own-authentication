'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from 'ui';

type TProps = {
	projectId: string;
};

export function ClientAnalyticsGeo({ projectId }: TProps) {
	return (
		<Card>
			<CardHeader>
				<CardTitle>Geographic Data</CardTitle>
				<CardDescription>Visitor locations and regional insights</CardDescription>
			</CardHeader>
			<CardContent>
				<div className="text-center text-muted-foreground py-8">
					Geographic analytics coming soon...
				</div>
			</CardContent>
		</Card>
	);
}
