	import { Spinner } from '@/shared/components/ui/spinner';
import { LoginView } from '@/views/login';
import { Suspense } from 'react';

export default function LoginPage() {
	return (
		<Suspense fallback={<Spinner className="h-6 w-6 text-muted-foreground" />}>
			<LoginView />
		</Suspense>
	);
}
