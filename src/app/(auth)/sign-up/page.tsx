import AuthFormShell from '@/features/auth/components/auth-form-shell'
import SignUpForm from '@/features/auth/components/sign-up-form'

export default function SignUpPage() {
	return (
		<AuthFormShell variant="signup">
			<SignUpForm />
		</AuthFormShell>
	)
}
