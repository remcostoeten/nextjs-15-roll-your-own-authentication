'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { register } from '@/features/authentication/actions';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

type RegisterFormData = {
  email: string;
  password: string;
}

export default function RegisterPage() {
  const { register: registerField, handleSubmit } = useForm<RegisterFormData>();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const router = useRouter();

  const onSubmit = handleSubmit(async (data: RegisterFormData) => {
    try {
      setIsLoading(true);
      setErrorMessage(null);
      const result = await register(data);
      
      if (result.success) {
        toast.success('Account created and logged in successfully!');
        router.push('/dashboard');
      } else {
        const errorMsg = result.error || 'Registration failed. Please try again.';
        setErrorMessage(errorMsg);
        toast.error(errorMsg);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to register. Please try again.';
      setErrorMessage(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Register</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2">
              <Input
                {...registerField('email')}
                type="email"
                placeholder="Email"
                required
              />
            </div>
            <div className="space-y-2">
              <Input
                {...registerField('password')}
                type="password"
                placeholder="Password"
                required
              />
            </div>
            {errorMessage && (
              <div className="text-red-500 text-sm">{errorMessage}</div>
            )}
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? 'Loading...' : 'Register'}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            Already have an account?{' '}
            <Link href="/login" className="text-blue-600 hover:underline">
              Login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
