import { Bell } from 'lucide-react';

export function NotificationsEmpty() {
	return (
		<div className="flex flex-col items-center justify-center p-8 text-center">
			<div className="rounded-full bg-muted p-3 mb-3">
				<Bell className="h-6 w-6 text-muted-foreground" />
			</div>
			<h3 className="text-sm font-medium">No notifications</h3>
			<p className="text-sm text-muted-foreground mt-1">
				You're all caught up! We'll notify you when something new arrives.
			</p>
		</div>
	);
}
