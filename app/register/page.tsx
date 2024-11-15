'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useRegister } from '@/features/authentication/mutations';
import Link from 'next/link';
import { useForm } from 'react-hook-form';

type RegisterFormData = {
  email: string;
  password: string;
}

export default function RegisterPage() {
  const { register, handleSubmit } = useForm<RegisterFormData>();
  const { register: registerUser, isLoading, error } = useRegister();

  const onSubmit = handleSubmit((data: RegisterFormData) => {
    registerUser(data);
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
            {error && (
              <div className="text-red-500 text-sm">{error}</div>
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
