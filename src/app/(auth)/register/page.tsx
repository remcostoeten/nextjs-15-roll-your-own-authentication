import { Spinner } from '@/shared/components/ui';
import { Suspense } from 'react';
import { RegisterForm } from './register-form';

export default function RegisterPage() {
	return (
		<Suspense fallback={<Spinner />}>
			<RegisterForm />
		</Suspense>
	);
}
