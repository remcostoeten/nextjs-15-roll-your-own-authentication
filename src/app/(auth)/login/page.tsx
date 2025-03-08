'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/modules/authentication/hooks';
import {
    AuthCard,
    AuthInput,
    AuthButton,
    AuthDivider,
    AuthSocialButton,
} from '@/shared/components/ui/auth-components';

export default function LoginPage() {
    const router = useRouter();
    const { login, isLoading, error } = useAuth();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        // Clear error when user types
        if (errors[name as keyof typeof errors]) {
            setErrors((prev) => ({ ...prev, [name]: undefined }));
        }
    };

    const validateForm = () => {
        const newErrors: { email?: string; password?: string } = {};

        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            await login(formData);
            router.push('/dashboard');
        } catch (error) {
            // Error is already handled by the auth store
        }
    };

    return (
        <AuthCard
            title="Log in to your account"
            subtitle="Welcome back! Please enter your details."
            footer={
                <p>
                    Don't have an account?{' '}
                    <Link href="/register" className="font-medium text-blue-600 hover:text-blue-500">
                        Sign up
                    </Link>
                </p>
            }
        >
            <form onSubmit={handleSubmit}>
                {error && (
                    <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-500">
                        {error}
                    </div>
                )}

                <AuthInput
                    label="Email"
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                    error={errors.email}
                    autoComplete="email"
                    required
                />

                <AuthInput
                    label="Password"
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    error={errors.password}
                    autoComplete="current-password"
                    required
                />

                <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center">
                        <input
                            id="remember"
                            name="remember"
                            type="checkbox"
                            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <label htmlFor="remember" className="ml-2 block text-sm text-gray-700">
                            Remember me
                        </label>
                    </div>

                    <Link href="/forgot-password" className="text-sm font-medium text-blue-600 hover:text-blue-500">
                        Forgot password?
                    </Link>
                </div>

                <AuthButton
                    type="submit"
                    fullWidth
                    isLoading={isLoading}
                    className="mb-3"
                >
                    Sign in
                </AuthButton>

                <AuthDivider />

                <div className="space-y-2">
                    <AuthSocialButton provider="github" fullWidth />
                    <AuthSocialButton provider="google" fullWidth />
                </div>
            </form>
        </AuthCard>
    );
} 