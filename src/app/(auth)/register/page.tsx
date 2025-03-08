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

export default function RegisterPage() {
    const router = useRouter();
    const { register, isLoading, error } = useAuth();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        firstName: '',
        lastName: '',
    });
    const [errors, setErrors] = useState<{
        email?: string;
        password?: string;
        confirmPassword?: string;
        firstName?: string;
        lastName?: string;
    }>({});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        // Clear error when user types
        if (errors[name as keyof typeof errors]) {
            setErrors((prev) => ({ ...prev, [name]: undefined }));
        }
    };

    const validateForm = () => {
        const newErrors: {
            email?: string;
            password?: string;
            confirmPassword?: string;
            firstName?: string;
            lastName?: string;
        } = {};

        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters';
        } else if (!/[A-Z]/.test(formData.password)) {
            newErrors.password = 'Password must contain at least one uppercase letter';
        } else if (!/[a-z]/.test(formData.password)) {
            newErrors.password = 'Password must contain at least one lowercase letter';
        } else if (!/[0-9]/.test(formData.password)) {
            newErrors.password = 'Password must contain at least one number';
        }

        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Please confirm your password';
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        if (formData.firstName && formData.firstName.length < 2) {
            newErrors.firstName = 'First name must be at least 2 characters';
        }

        if (formData.lastName && formData.lastName.length < 2) {
            newErrors.lastName = 'Last name must be at least 2 characters';
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
            await register(formData);
            // User is automatically logged in after registration
            router.push('/dashboard');
        } catch (error) {
            // Error is already handled by the auth store
        }
    };

    return (
        <AuthCard
            title="Create an account"
            subtitle="Start your journey with us today!"
            footer={
                <p>
                    Already have an account?{' '}
                    <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500">
                        Sign in
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

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <AuthInput
                        label="First Name"
                        id="firstName"
                        name="firstName"
                        type="text"
                        placeholder="Enter your first name"
                        value={formData.firstName}
                        onChange={handleChange}
                        error={errors.firstName}
                        autoComplete="given-name"
                    />

                    <AuthInput
                        label="Last Name"
                        id="lastName"
                        name="lastName"
                        type="text"
                        placeholder="Enter your last name"
                        value={formData.lastName}
                        onChange={handleChange}
                        error={errors.lastName}
                        autoComplete="family-name"
                    />
                </div>

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
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={handleChange}
                    error={errors.password}
                    helper="Password must be at least 8 characters and include uppercase, lowercase, and numbers"
                    autoComplete="new-password"
                    required
                />

                <AuthInput
                    label="Confirm Password"
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    error={errors.confirmPassword}
                    autoComplete="new-password"
                    required
                />

                <div className="mb-4 mt-6">
                    <AuthButton
                        type="submit"
                        fullWidth
                        isLoading={isLoading}
                    >
                        Create Account
                    </AuthButton>
                </div>

                <AuthDivider />

                <div className="space-y-2">
                    <AuthSocialButton provider="github" fullWidth />
                    <AuthSocialButton provider="google" fullWidth />
                </div>
            </form>
        </AuthCard>
    );
} 