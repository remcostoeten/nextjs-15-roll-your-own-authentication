'use client';

import { AuthFormContainer } from '@/modules/authenticatie/ui/auth-form-container';

export function LoginForm({ className, ...props }: React.ComponentProps<'div'>) {
	return <AuthFormContainer className={className} defaultMode="login" {...props} />;
}
