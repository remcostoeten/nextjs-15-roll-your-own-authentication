import React, { forwardRef } from 'react';
import { theme } from '@/shared/styles/vercel-inspired-theme';

type VercelInputProps = {
  label?: string;
  error?: string;
  helper?: string;
  icon?: React.ReactNode;
} & React.InputHTMLAttributes<HTMLInputElement>;

export const VercelInput = forwardRef<HTMLInputElement, VercelInputProps>(
  ({ label, error, helper, icon, className, ...props }, ref) => {
    return (
      <div className="mb-5">
        {label && (
          <label
            htmlFor={props.id}
            className="mb-1.5 block text-sm font-medium text-black"
          >
            {label}
          </label>
        )}
        
        <div className="relative">
          {icon && (
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
              {icon}
            </div>
          )}
          
          <input
            ref={ref}
            className={`w-full rounded-md border bg-white px-3 py-2 text-sm transition-all duration-200 focus:outline-none ${
              error ? 'border-red-500' : 'border-gray-300 focus:border-black focus:ring-1 focus:ring-black'
            } ${
              icon ? 'pl-10' : ''
            }`}
            {...props}
          />
        </div>
        
        {error && (
          <p className="mt-1.5 text-xs text-red-500">
            {error}
          </p>
        )}
        
        {helper && !error && (
          <p className="mt-1.5 text-xs text-gray-500">
            {helper}
          </p>
        )}
      </div>
    );
  }
); 