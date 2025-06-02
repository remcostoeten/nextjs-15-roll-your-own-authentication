import { Suspense } from 'react';
import { LoginForm } from './login-form';

/**
 * Displays the login form within a suspense boundary, showing a loading indicator while the form is loading.
 */
export default function LoginPage() {
	return (
		<Suspense fallback={<div>Loading...</div>}>
			<LoginForm />
		</Suspense>
	);
}
