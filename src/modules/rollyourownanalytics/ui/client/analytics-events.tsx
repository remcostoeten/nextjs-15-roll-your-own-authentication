'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from 'ui';

type TProps = {
	projectId: string;
};

export function ClientAnalyticsEvents({ projectId }: TProps) {
	return (
		<Card>
			<CardHeader>
				<CardTitle>Events</CardTitle>
				<CardDescription>Custom events and user interactions</CardDescription>
			</CardHeader>
			<CardContent>
				<div className="text-center text-muted-foreground py-8">
					Event analytics coming soon...
				</div>
			</CardContent>
		</Card>
	);
}
