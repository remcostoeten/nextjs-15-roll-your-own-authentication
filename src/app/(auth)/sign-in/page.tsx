import AuthFormShell from '@/features/auth/components/auth-form-shell'
import SignInForm from '@/features/auth/components/sign-in-form'

export default function SignInPage() {
	return (
		<AuthFormShell variant="signin">
			<SignInForm />
		</AuthFormShell>
	)
}
