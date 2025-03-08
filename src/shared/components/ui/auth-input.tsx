import React, { forwardRef } from 'react';
import { authTheme } from './auth-theme';

type AuthInputProps = {
    label?: string;
    error?: string;
    helper?: string;
    icon?: React.ReactNode;
} & React.InputHTMLAttributes<HTMLInputElement>;

export const AuthInput = forwardRef<HTMLInputElement, AuthInputProps>(
    ({ label, error, helper, icon, className, ...props }, ref) => {
        return (
            <div className="mb-4">
                {label && (
                    <label
                        htmlFor={props.id}
                        className="mb-2 block text-sm font-medium text-gray-900"
                    >
                        {label}
                    </label>
                )}

                <div className="relative">
                    {icon && (
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            {icon}
                        </div>
                    )}

                    <input
                        ref={ref}
                        className={`w-full rounded-md border ${error ? 'border-red-500' : 'border-gray-300'
                            } px-3 py-2 text-sm ${icon ? 'pl-10' : ''
                            } focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                        {...props}
                    />
                </div>

                {error && (
                    <p className="mt-1 text-xs text-red-500">{error}</p>
                )}

                {helper && !error && (
                    <p className="mt-1 text-xs text-gray-500">{helper}</p>
                )}
            </div>
        );
    }
); 