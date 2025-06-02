import { unstable_ViewTransition as ViewTransition } from 'react';

/**
 * Provides a centered, full-screen layout for authentication pages with a muted background.
 *
 * Wraps the content in a view transition for smooth visual updates.
 *
 * @param children - The content to display within the authentication layout.
 */
export default function AuthLayout({ children }: PageProps) {
	return (
		<ViewTransition>
			<div className="min-h-screen w-screen bg-muted flex items-center justify-center p-4">
				{children}
			</div>
		</ViewTransition>
	);
}
