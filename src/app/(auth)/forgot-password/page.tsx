'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
    AuthCard,
    AuthInput,
    AuthButton,
} from '@/shared/components/ui/auth-components';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            // In a real app, you would call your API to send a password reset email
            // await sendPasswordResetEmail(email);

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));

            setSuccess(true);
        } catch (error) {
            setError('An error occurred while trying to send the password reset email. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    if (success) {
        return (
            <AuthCard
                title="Check your email"
                subtitle="We've sent you a link to reset your password. The link will expire in 10 minutes."
                footer={
                    <p>
                        <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500">
                            Back to login
                        </Link>
                    </p>
                }
            >
                <div className="flex flex-col items-center justify-center py-8">
                    <div className="mb-4 text-center">
                        <svg
                            className="mx-auto h-12 w-12 text-green-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                    </div>
                    <p className="text-center text-gray-600">
                        Didn't receive an email? Check your spam folder or{' '}
                        <button
                            type="button"
                            onClick={() => setSuccess(false)}
                            className="font-medium text-blue-600 hover:text-blue-500"
                        >
                            try again
                        </button>
                    </p>
                </div>
            </AuthCard>
        );
    }

    return (
        <AuthCard
            title="Reset your password"
            subtitle="Enter your email address and we'll send you a link to reset your password."
            footer={
                <p>
                    Remember your password?{' '}
                    <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500">
                        Back to login
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
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    required
                    autoComplete="email"
                />

                <div className="mt-6">
                    <AuthButton
                        type="submit"
                        fullWidth
                        isLoading={isLoading}
                    >
                        Send reset link
                    </AuthButton>
                </div>
            </form>
        </AuthCard>
    );
} 