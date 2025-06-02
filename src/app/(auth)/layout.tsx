import { unstable_ViewTransition as ViewTransition } from 'react';

export default function AuthLayout({ children }: PageProps) {
	return (
		<ViewTransition>
			<div className="min-h-screen w-screen bg-muted flex items-center justify-center p-4">
				{children}
			</div>
		</ViewTransition>
	);
}
