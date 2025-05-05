'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { useEffect } from 'react';
import { showToast } from '@/components/ui/toast/CustomToast';
import { ZodIssue } from 'zod';
import Link from 'next/link'; // Import Link
import { login } from '@/modules/auth/api/actions/auth.actions';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className={`w-full px-4 py-2 font-semibold text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
        pending ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
      }`}
    >
      {pending ? 'Logging In...' : 'Login'}
    </button>
  );
}

export default function LoginPage() {
  const initialState = { success: false, message: '', error: undefined };
  const [state, formAction] = useFormState(async (state, formData: FormData) => {
    try {
      const email = formData.get('email') as string;
      const password = formData.get('password') as string;
      
      // Add your authentication logic here
      // Return success state
      return { success: true, message: 'Login successful', error: undefined };
    } catch (error) {
      return { 
        success: false, 
        message: 'Login failed', 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }, initialState);

  useEffect(() => {
    if (state?.success) {
      showToast({ message: 'Login successful!', type: 'success' });
    } else if (state?.error) {
      showToast({ 
        message: Array.isArray(state.error) 
          ? state.error[0]?.message || 'Login failed' 
          : state.error || 'Login failed', 
        type: 'error' 
      });
    }
  }, [state]);

  const getFieldError = (fieldName: string): string | undefined => {
    if (state?.error && Array.isArray(state.error)) {
        const fieldError = state.error.find((err: ZodIssue) => err.path.includes(fieldName));
        return fieldError?.message;
    }
    return undefined;
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-900">Login</h2>
        <form action={formAction} className="space-y-6">
          {!state?.success && state?.message && !state.error && (
            <div className="p-3 text-sm text-red-700 bg-red-100 border border-red-200 rounded-md">
              {state.message}
            </div>
          )}

          <div>
            <label
              htmlFor="identifier"
              className="block text-sm font-medium text-gray-700"
            >
              Email or Username
            </label>
            <input
              id="identifier"
              name="identifier"
              type="text"
              required
              className="block w-full px-3 py-2 mt-1 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm appearance-none focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              aria-describedby="identifier-error"
            />
             {getFieldError('identifier') && (
                <p className="mt-1 text-xs text-red-600" id="identifier-error">
                    {getFieldError('identifier')}
                </p>
            )}
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="block w-full px-3 py-2 mt-1 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm appearance-none focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              aria-describedby="password-error"
            />
             {getFieldError('password') && (
                <p className="mt-1 text-xs text-red-600" id="password-error">
                    {getFieldError('password')}
                </p>
            )}
          </div>

          <div>
            <SubmitButton />
          </div>
        </form>
         <p className="text-sm text-center text-gray-600">
            Don't have an account?{' '}
            <Link href="/register" className="font-medium text-indigo-600 hover:text-indigo-500">
                Register here
            </Link>
        </p>
      </div>
    </div>
  );
}
