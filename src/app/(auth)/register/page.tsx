'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/modules/authentication/hooks';

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
        <div className="flex min-h-screen w-full flex-col items-center justify-center bg-[#0a0a0a] text-white">
            <div className="w-full max-w-[500px] px-8">
                {/* Logo */}
                <div className="mb-8 flex justify-center">
                    <div className="h-12 w-12 rounded-full bg-[#2E71E5] flex items-center justify-center">
                        <svg 
                            viewBox="0 0 24 24" 
                            width="24" 
                            height="24" 
                            stroke="currentColor" 
                            strokeWidth="2" 
                            fill="none" 
                            strokeLinecap="round" 
                            strokeLinejoin="round"
                        >
                            <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                            <polyline points="10 17 15 12 10 7" />
                            <line x1="15" y1="12" x2="3" y2="12" />
                        </svg>
                    </div>
                </div>
                
                {/* Title */}
                <div className="mb-8 text-center">
                    <h1 className="mb-2 text-3xl font-bold">Create an account</h1>
                    <p className="text-sm text-gray-400">
                        Already have an account?{' '}
                        <Link href="/login" className="text-[#2E71E5] hover:underline">
                            Sign in
                        </Link>
                    </p>
                </div>
                
                <form onSubmit={handleSubmit}>
                    {error && (
                        <div className="mb-6 rounded-md bg-red-900/20 p-3 text-sm text-red-500 border border-red-900/50">
                            {error}
                        </div>
                    )}
                    
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mb-5">
                        <div>
                            <label 
                                htmlFor="firstName" 
                                className="mb-2 block text-sm font-medium text-gray-200"
                            >
                                First Name
                            </label>
                            <input
                                id="firstName"
                                name="firstName"
                                type="text"
                                placeholder="John"
                                value={formData.firstName}
                                onChange={handleChange}
                                className={`w-full rounded-md border bg-[#111111] px-3 py-2 text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#2E71E5] ${
                                    errors.firstName ? 'border-red-500' : 'border-gray-700'
                                }`}
                            />
                            {errors.firstName && (
                                <p className="mt-1.5 text-xs text-red-500">{errors.firstName}</p>
                            )}
                        </div>
                        
                        <div>
                            <label 
                                htmlFor="lastName" 
                                className="mb-2 block text-sm font-medium text-gray-200"
                            >
                                Last Name
                            </label>
                            <input
                                id="lastName"
                                name="lastName"
                                type="text"
                                placeholder="Doe"
                                value={formData.lastName}
                                onChange={handleChange}
                                className={`w-full rounded-md border bg-[#111111] px-3 py-2 text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#2E71E5] ${
                                    errors.lastName ? 'border-red-500' : 'border-gray-700'
                                }`}
                            />
                            {errors.lastName && (
                                <p className="mt-1.5 text-xs text-red-500">{errors.lastName}</p>
                            )}
                        </div>
                    </div>
                    
                    <div className="mb-5">
                        <label 
                            htmlFor="email" 
                            className="mb-2 block text-sm font-medium text-gray-200"
                        >
                            Email address
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="you@example.com"
                            value={formData.email}
                            onChange={handleChange}
                            className={`w-full rounded-md border bg-[#111111] px-3 py-2 text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#2E71E5] ${
                                errors.email ? 'border-red-500' : 'border-gray-700'
                            }`}
                            required
                        />
                        {errors.email && (
                            <p className="mt-1.5 text-xs text-red-500">{errors.email}</p>
                        )}
                    </div>
                    
                    <div className="mb-5">
                        <label 
                            htmlFor="password" 
                            className="mb-2 block text-sm font-medium text-gray-200"
                        >
                            Password
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={handleChange}
                            className={`w-full rounded-md border bg-[#111111] px-3 py-2 text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#2E71E5] ${
                                errors.password ? 'border-red-500' : 'border-gray-700'
                            }`}
                            required
                        />
                        {errors.password && (
                            <p className="mt-1.5 text-xs text-red-500">{errors.password}</p>
                        )}
                        {!errors.password && (
                            <p className="mt-1.5 text-xs text-gray-500">
                                Password must be at least 8 characters and include uppercase, lowercase, and numbers
                            </p>
                        )}
                    </div>
                    
                    <div className="mb-5">
                        <label 
                            htmlFor="confirmPassword" 
                            className="mb-2 block text-sm font-medium text-gray-200"
                        >
                            Confirm Password
                        </label>
                        <input
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            placeholder="••••••••"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className={`w-full rounded-md border bg-[#111111] px-3 py-2 text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#2E71E5] ${
                                errors.confirmPassword ? 'border-red-500' : 'border-gray-700'
                            }`}
                            required
                        />
                        {errors.confirmPassword && (
                            <p className="mt-1.5 text-xs text-red-500">{errors.confirmPassword}</p>
                        )}
                    </div>
                    
                    <div className="mb-6 mt-8">
                        <button
                            type="submit"
                            className="w-full rounded-md bg-[#2E71E5] py-2 px-4 text-sm font-medium text-white transition-colors hover:bg-[#2E71E5]/90 focus:outline-none focus:ring-2 focus:ring-[#2E71E5] focus:ring-offset-2 focus:ring-offset-[#0a0a0a] disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <svg
                                        className="mr-2 h-4 w-4 animate-spin text-current"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                        />
                                        <path
                                            className="opacity-75"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                            fill="currentColor"
                                        />
                                    </svg>
                                    <span>Creating account...</span>
                                </>
                            ) : (
                                <span>Create account &rarr;</span>
                            )}
                        </button>
                    </div>
                </form>
                
                <div className="mt-4">
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-800"></div>
                        </div>
                        <div className="relative flex justify-center text-xs">
                            <span className="bg-[#0a0a0a] px-2 text-gray-500 uppercase">
                                Or sign up with
                            </span>
                        </div>
                    </div>
                    
                    <div className="mt-6 grid grid-cols-3 gap-3">
                        <button
                            type="button"
                            className="inline-flex w-full justify-center rounded-md border border-gray-800 bg-[#111111] py-2 px-3 text-sm font-medium text-gray-300 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-[#2E71E5] focus:ring-offset-2 focus:ring-offset-[#0a0a0a]"
                        >
                            <svg className="h-5 w-5" aria-hidden="true" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12" />
                            </svg>
                        </button>
                        <button
                            type="button"
                            className="inline-flex w-full justify-center rounded-md border border-gray-800 bg-[#111111] py-2 px-3 text-sm font-medium text-gray-300 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-[#2E71E5] focus:ring-offset-2 focus:ring-offset-[#0a0a0a]"
                        >
                            <svg className="h-5 w-5" aria-hidden="true" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M23.954 4.569c-.885.389-1.83.654-2.825.775 1.014-.611 1.794-1.574 2.163-2.723-.951.555-2.005.959-3.127 1.184-.896-.959-2.173-1.559-3.591-1.559-2.717 0-4.92 2.203-4.92 4.917 0 .39.045.765.127 1.124C7.691 8.094 4.066 6.13 1.64 3.161c-.427.722-.666 1.561-.666 2.475 0 1.71.87 3.213 2.188 4.096-.807-.026-1.566-.248-2.228-.616v.061c0 2.385 1.693 4.374 3.946 4.827-.413.111-.849.171-1.296.171-.314 0-.615-.03-.916-.086.631 1.953 2.445 3.377 4.604 3.417-1.68 1.319-3.809 2.105-6.102 2.105-.39 0-.779-.023-1.17-.067 2.189 1.394 4.768 2.209 7.557 2.209 9.054 0 14-7.503 14-14 0-.21-.015-.41-.048-.618.961-.689 1.8-1.56 2.46-2.548" />
                            </svg>
                        </button>
                        <button
                            type="button"
                            className="inline-flex w-full justify-center rounded-md border border-gray-800 bg-[#111111] py-2 px-3 text-sm font-medium text-gray-300 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-[#2E71E5] focus:ring-offset-2 focus:ring-offset-[#0a0a0a]"
                        >
                            <svg className="h-5 w-5" aria-hidden="true" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
} 