'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from 'ui';

type TProps = {
	projectId: string;
};

export function ClientAnalyticsPages({ projectId }: TProps) {
	return (
		<Card>
			<CardHeader>
				<CardTitle>Top Pages</CardTitle>
				<CardDescription>Most visited pages and their performance</CardDescription>
			</CardHeader>
			<CardContent>
				<div className="text-center text-muted-foreground py-8">
					Page analytics coming soon...
				</div>
			</CardContent>
		</Card>
	);
}
