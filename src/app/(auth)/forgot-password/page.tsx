'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!email) {
            setError('Please enter your email address');
            return;
        }
        
        if (!/\S+@\S+\.\S+/.test(email)) {
            setError('Please enter a valid email address');
            return;
        }
        
        setIsLoading(true);
        setError('');
        
        try {
            // Normally you would call your API here to send a password reset email
            // For demo purposes, we'll just simulate an API call with a timeout
            await new Promise(resolve => setTimeout(resolve, 1500));
            setSuccess(true);
        } catch (err) {
            setError('An error occurred. Please try again.');
        } finally {
            setIsLoading(false);
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
                            <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                    </div>
                </div>
                
                {/* Title */}
                <div className="mb-8 text-center">
                    <h1 className="mb-2 text-3xl font-bold">Reset your password</h1>
                    <p className="text-sm text-gray-400">
                        We'll send a password reset link to your email
                    </p>
                </div>
                
                {success ? (
                    <div className="rounded-md bg-[#172a45]/30 p-4 text-sm text-[#2E71E5] border border-[#2E71E5]/20">
                        <div className="mb-2 font-medium">Check your email</div>
                        <p className="mb-4">
                            We've sent a password reset link to {email}. The link will expire in 1 hour.
                        </p>
                        <Link 
                            href="/login" 
                            className="inline-flex rounded-md bg-[#2E71E5] py-2 px-4 text-sm font-medium text-white hover:bg-[#2E71E5]/90 focus:outline-none focus:ring-2 focus:ring-[#2E71E5] focus:ring-offset-1 focus:ring-offset-[#0a0a0a]"
                        >
                            Back to login
                        </Link>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit}>
                        {error && (
                            <div className="mb-6 rounded-md bg-red-900/20 p-3 text-sm text-red-500 border border-red-900/50">
                                {error}
                            </div>
                        )}
                        
                        <div className="mb-5">
                            <label 
                                htmlFor="email" 
                                className="mb-2 block text-sm font-medium text-gray-200"
                            >
                                Email address
                            </label>
                            <input
                                id="email"
                                type="email"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    setError('');
                                }}
                                className={`w-full rounded-md border ${
                                    error ? 'border-red-500' : 'border-gray-700'
                                } bg-[#111111] px-3 py-2 text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#2E71E5]`}
                                required
                            />
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
                                        <span>Sending reset link...</span>
                                    </>
                                ) : (
                                    <span>Send reset link &rarr;</span>
                                )}
                            </button>
                        </div>
                        
                        <div className="text-center mt-6">
                            <Link 
                                href="/login" 
                                className="text-sm text-gray-400 hover:text-white"
                            >
                                &larr; Back to login
                            </Link>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
} 