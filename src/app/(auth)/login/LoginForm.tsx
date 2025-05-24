'use client';

import { login } from '@/modules/authenticatie/server/mutations/login';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import Link from 'next/link';
import { useRef, useState } from 'react';
import { useFormStatus } from 'react-dom';

function LoginButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? 'Signing in...' : 'Sign in with Email'}
    </Button>
  );
}

export function LoginForm() {
  const [error, setError] = useState<string>('');
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(formData: FormData) {
    setError('');
    try {
      await login(formData);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to login');
      formRef.current?.reset();
    }
  }

  return (
    <div className="grid gap-6">
      <form ref={formRef} action={handleSubmit}>
        {error && (
          <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md">
            {error}
          </div>
        )}
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="name@example.com"
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              required
            />
          </div>
          <LoginButton />
        </div>
      </form>
      <div className="text-center text-sm">
        <span className="text-muted-foreground">Don't have an account? </span>
        <Link
          href="/register"
          className="text-primary underline-offset-4 hover:underline"
        >
          Sign up
        </Link>
      </div>
    </div>
  );
}
