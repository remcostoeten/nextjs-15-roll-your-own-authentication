import AuthButton from '@/shared/components/action-button-wrapper';
import Link from 'next/link';
import React, { ReactNode } from 'react';

type AuthFormWrapperProps = {
  title: string;
  children: ReactNode;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  isLoading: boolean;
  submitText: string;
  alternativeText: string;
  alternativeLink: string;
  alternativeLinkText: string;
  errorMessage?: string | null;
  formState?: 'success' | 'error' | null;
}

export default function AuthFormWrapper({
  title,
  children,
  onSubmit,
  isLoading,
  submitText,
  alternativeText,
  alternativeLink,
  alternativeLinkText,
  errorMessage,
  formState
}: AuthFormWrapperProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md">
        <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <h2 className="text-2xl font-bold text-center mb-6">{title}</h2>
          <form onSubmit={onSubmit} className="space-y-4">
            {children}
            {errorMessage && (
              <div role="alert" className="text-red-500 text-sm">{errorMessage}</div>
            )}
            <AuthButton
              text={submitText}
              type="submit"
              isLoading={isLoading}
              variant="auth"
              className="w-full"
              formState={formState}
            />
          </form>
          {alternativeText && (
            <div className="mt-4 text-center text-sm">
              {alternativeText}{' '}
              <Link href={alternativeLink} className="text-primary hover:underline">
                {alternativeLinkText}
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
