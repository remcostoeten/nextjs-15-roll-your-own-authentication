import React from 'react';
import { authTheme } from './auth-theme';

type AuthCardProps = {
    children: React.ReactNode;
    title: string;
    subtitle?: string;
    footer?: React.ReactNode;
    maxWidth?: string;
} & React.HTMLAttributes<HTMLDivElement>;

export function AuthCard({
    children,
    title,
    subtitle,
    footer,
    maxWidth = '400px',
    ...props
}: AuthCardProps) {
    return (
        <div
            className="flex min-h-[calc(100vh-100px)] w-full items-center justify-center p-4"
            {...props}
        >
            <div
                className="w-full rounded-lg border border-gray-200 bg-white p-8 shadow-sm"
                style={{ maxWidth }}
            >
                <div className="mb-6 text-center">
                    <h1 className="mb-2 text-2xl font-semibold text-gray-900">{title}</h1>
                    {subtitle && (
                        <p className="text-sm text-gray-600">{subtitle}</p>
                    )}
                </div>

                <div>{children}</div>

                {footer && (
                    <div className="mt-6 text-center text-sm text-gray-600">
                        {footer}
                    </div>
                )}
            </div>
        </div>
    );
} 