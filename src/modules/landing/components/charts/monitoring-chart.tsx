'use client';

import { Activity } from 'lucide-react';

export function MonitoringChart() {
	return (
		<div className="mt-8 flex h-[200px] w-full items-center justify-center rounded-lg border bg-muted/5">
			<div className="flex flex-col items-center gap-2 text-muted-foreground">
				<Activity className="size-8" />
				<span>Activity data visualization goes here</span>
			</div>
		</div>
	);
}
