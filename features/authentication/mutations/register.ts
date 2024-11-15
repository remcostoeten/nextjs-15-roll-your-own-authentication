'use server';

import { registerUser } from '@/features/authentication/mutations';
import { ActionResponse, AuthCredentials } from '../types';
import { login } from './login';

export async function register(credentials: AuthCredentials): Promise<ActionResponse> {
  try {
    await registerUser(credentials);
    const loginResponse = await login(credentials);
    return loginResponse;
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Registration failed. Please try again.'
    };
  }
} 
