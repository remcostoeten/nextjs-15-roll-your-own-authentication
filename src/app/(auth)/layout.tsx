// import { Center } from '@/shared/components/center';

// export default function RootLayout({ children }: PageProps) {
// 	return (
// 		<Center fullscreen grid>
// 			{children}
// 		</Center>
// 	);
// }

// app/(auth)/layout.tsx
import { PropsWithChildren, unstable_ViewTransition as ViewTransition } from 'react';

export default function AuthLayout({ children }: PropsWithChildren) {
	return (
		<ViewTransition>
			<div className="min-h-screen w-full bg-muted flex items-center justify-center p-4">
				{children}
			</div>
		</ViewTransition>
	);
}
