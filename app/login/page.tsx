'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { login } from '@/features/authentication/actions';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

type LoginCredentials = {
  email: string;
  password: string;
};

export default function LoginPage() {
  const { register, handleSubmit } = useForm<LoginCredentials>();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const onSubmit = handleSubmit(async (data: LoginCredentials) => {
    try {
      setIsLoading(true);
      const result = await login(data);
      
      if (result.success) {
        toast.success('Successfully logged in!');
        router.push('/dashboard');
      } else {
        toast.error(result.error || 'Login failed');
      }
    } catch (error) {
      toast.error('Failed to login. Please try again.');
    } finally {
      setIsLoading(false);
    }
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Login</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2">
              <Input
                {...register('email')}
                type="email"
                placeholder="Email"
                required
              />
            </div>
            <div className="space-y-2">
              <Input
                {...register('password')}
                type="password"
                placeholder="Password"
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? 'Loading...' : 'Login'}
            </Button>
          </form>
           <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="text-blue-600 hover:underline">
              Register
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
