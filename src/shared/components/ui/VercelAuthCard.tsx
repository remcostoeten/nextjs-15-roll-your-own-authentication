import React from 'react';
import { theme } from '@/shared/styles/vercel-inspired-theme';

type VercelAuthCardProps = {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  footer?: React.ReactNode;
  maxWidth?: string;
  logoUrl?: string;
} & React.HTMLAttributes<HTMLDivElement>;

export function VercelAuthCard({
  children,
  title,
  subtitle,
  footer,
  maxWidth = '400px',
  logoUrl,
  ...props
}: VercelAuthCardProps) {
  return (
    <div
      className="flex min-h-[calc(100vh-120px)] w-full items-center justify-center p-4"
      style={{ background: '#fafafa' }}
      {...props}
    >
      <div
        className="w-full overflow-hidden rounded-md border border-gray-200 bg-white p-8 shadow-md transition-all"
        style={{ maxWidth }}
      >
        {logoUrl && (
          <div className="mb-8 flex justify-center">
            <img src={logoUrl} alt="Logo" className="h-8" />
          </div>
        )}
        
        {!logoUrl && (
          <div className="mb-8 flex justify-center">
            <div className="h-8 w-8 bg-black rounded-sm flex items-center justify-center">
              <span className="text-white font-bold">R</span>
            </div>
          </div>
        )}
        
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-3xl font-semibold tracking-tight text-black">
            {title}
          </h1>
          {subtitle && (
            <p className="text-sm text-gray-500">
              {subtitle}
            </p>
          )}
        </div>
        
        <div>{children}</div>
        
        {footer && (
          <div className="mt-8 text-center text-sm text-gray-500">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
} 