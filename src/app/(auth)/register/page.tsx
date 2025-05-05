'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { useEffect } from 'react';
import { ZodIssue } from 'zod';
import Link from 'next/link';
import { register } from '@/modules/auth/api/actions/auth.actions';

type ActionResult = {
  success: boolean;
  message: string;
  error?: string | ZodIssue[];
};

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
      {pending ? 'Registering...' : 'Register'}
    </button>
  );
}

export default function RegisterPage() {
  const initialState: ActionResult = { success: false, message: '', error: undefined };
  const [state, formAction] = useFormState(async (_prevState: ActionResult, formData: FormData) => {
    return register(formData);
  }, initialState);

  useEffect(() => {
    if (state?.success) {
      console.log('Registration successful (client-side state)');
    }
  }, [state?.success]);

  const getFieldError = (fieldName: string): string | undefined => {
    if (state?.error && Array.isArray(state.error)) {
        const fieldError = state.error.find((err: ZodIssue) => err.path.includes(fieldName));
        return fieldError?.message;
    }
    // Handle general string error message if needed, although Zod errors are more specific
    // if (typeof state?.error === 'string' && !Array.isArray(state.error)) {
    //     // You might want logic here if the error isn't a ZodIssue array
    // }
    return undefined;
  };

   const generalErrorMessage = (!state?.success && state?.message && (!state.error || typeof state.error === 'string')) ? state.message : null;


  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-900">Create Account</h2>
        <form action={formAction} className="space-y-4"> {/* Reduced space */}
          {generalErrorMessage && (
            <div className="p-3 text-sm text-red-700 bg-red-100 border border-red-200 rounded-md">
              {generalErrorMessage}
            </div>
          )}

          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700"
            >
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              required
              className="block w-full px-3 py-2 mt-1 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm appearance-none focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              aria-describedby="username-error"
            />
             {getFieldError('username') && (
                <p className="mt-1 text-xs text-red-600" id="username-error">
                    {getFieldError('username')}
                </p>
            )}
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="block w-full px-3 py-2 mt-1 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm appearance-none focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              aria-describedby="email-error"
            />
             {getFieldError('email') && (
                <p className="mt-1 text-xs text-red-600" id="email-error">
                    {getFieldError('email')}
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
              minLength={8}
              className="block w-full px-3 py-2 mt-1 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm appearance-none focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              aria-describedby="password-error"
            />
             {getFieldError('password') && (
                <p className="mt-1 text-xs text-red-600" id="password-error">
                    {getFieldError('password')}
                </p>
            )}
          </div>

          {/* Optional: Confirm Password (add to schema and action if needed) */}
          {/* <div> ... </div> */}

          <div className="pt-2"> {/* Add padding top */}
            <SubmitButton />
          </div>
        </form>
         <p className="text-sm text-center text-gray-600">
            Already have an account?{' '}
            <Link href="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                Login here
            </Link>
        </p>
      </div>
    </div>
  );
}
